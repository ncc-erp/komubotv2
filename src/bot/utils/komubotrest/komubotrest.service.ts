import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ActionRowBuilder,
  ButtonBuilder,
  Client,
  EmbedBuilder,
  Message,
  User as UserDiscord,
} from "discord.js";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { TABLE } from "src/bot/constants/table";
import { GetUserIdByEmailDTO } from "src/bot/dto/getUserIdByEmail";
import { GetUserIdByUsernameDTO } from "src/bot/dto/getUserIdByUsername";
import { SendEmbedMessageDTO } from "src/bot/dto/sendEmbedMessage";
import {
  SendImageCheckInToUserDTO,
  SendImageLabelToUserDTO,
} from "src/bot/dto/sendImageCheckInToUser";
import { SendMessageToChannelDTO } from "src/bot/dto/sendMessageToChannel";
import { SendMessageToUserDTO } from "src/bot/dto/sendMessageToUser";
import { Channel } from "src/bot/models/channel.entity";
import { Msg } from "src/bot/models/msg.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { Brackets, Repository } from "typeorm";

@Injectable()
export class KomubotrestService {
  constructor(
    // private clientConfigServiec : ClientConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Msg)
    private messageRepository: Repository<Msg>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(WorkFromHome)
    private wfhRepository: Repository<WorkFromHome>,
    private clientConfig: ClientConfigService
  ) {}
  private data;
  async findUserData(_pramams) {
    return await this.userRepository
      .createQueryBuilder()
      .where(
        new Brackets((qb) => {
          qb.where(`"email" = :email`, {
            email: _pramams,
          }).andWhere(`"deactive" IS NOT true`);
        })
      )
      .orWhere(
        new Brackets((qb) => {
          qb.where(`"username" = :username`, {
            username: _pramams,
          }).andWhere(`"deactive" IS NOT true`);
        })
      )
      .getOne();
  }
  async insertNewMsg(sent) {
    return await this.messageRepository
      .createQueryBuilder()
      .insert()
      .into(TABLE.MSG)
      .values([
        {
          sent,
        },
      ])
      .returning("*");
  }
  async replaceDataUser(userdb) {
    console.log(userdb);
    return await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        last_bot_message_id: userdb.last_bot_message_id,
        botPing: userdb.botPing,
      })
      .where(`"userId" = :userId`, { userId: userdb.userId })
      .execute();
  }
  async insertDataToWFH(_userid, _wfhMsg, _complain, _pmconfirm, _status) {
    return await this.wfhRepository.save({
      userid: _userid,
      wfhMsg: _wfhMsg,
      complain: _complain,
      pmconfirm: _pmconfirm,
      status: _status,
      createdAt: Date.now(),
    });
  }
  async findUserOne(userId) {
    return await this.userRepository
      .createQueryBuilder()
      .where(`"userId" = :userId`, {
        userId: userId,
      })
      .getRawOne();
  }
  async findAllUser() {
    return await this.userRepository.createQueryBuilder(TABLE.USER).getMany();
  }
  getUserIdByUsername = async (
    client,
    getUserIdByUsernameDTO: GetUserIdByUsernameDTO,
    header,
    res
  ) => {
    if (!header || header !== this.clientConfig.machleoChannelId) {
      res.status(403).send({ message: "Missing secret key!" });
      return;
    }

    if (!getUserIdByUsernameDTO.username) {
      res.status(400).send({ message: "username can not be empty!" });
      return;
    }

    const userdb = await this.findUserData(getUserIdByUsernameDTO.username);
    if (!userdb) {
      res.status(400).send({ message: "User not found!" });
      return;
    }

    res.status(200).send({
      username: getUserIdByUsernameDTO.username,
      userid: userdb.userId,
    });
  };

  //todo :
  sendMessageKomuToUser = async (
    client: Client,
    msg,
    username,
    botPing = false,
    isSendQuiz = false
  ) => {
    try {
      const userdb = await this.userRepository
        .createQueryBuilder()
        .where('"email" = :username and deactive IS NOT True ', {
          username: username,
        })
        .orWhere('"username" = :username and deactive IS NOT True ', {
          username: username,
        })
        .select("*")
        .getRawOne()
        .catch(console.error);
      if (!userdb) {
        return null;
      }
      let user = await client.users.fetch(userdb.userId).catch(console.error);
      if (msg == null) {
        return user;
      }
      if (!user) {
        // notify to machleo channel
        const message = `<@${this.clientConfig.komubotrestAdminId}> ơi, đồng chí ${username} không đúng format rồi!!!`;
        await (client.channels.cache as any)
          .get(this.clientConfig.machleoChannelId)
          .send(message)
          .catch(console.error);
        return null;
        ``;
      }
      const sent = await user.send(msg);

      const channelInsert = await this.channelRepository.findOne({
        where: {
          id: this.clientConfig.machleoChannelId,
        },
      });

      try {
        await this.messageRepository.insert({
          id: sent.id,
          author: userdb,
          guildId: sent.guildId,
          type: sent.type.toString(),
          createdTimestamp: sent.createdTimestamp,
          system: sent.system,
          content: sent.content,
          pinned: sent.pinned,
          tts: sent.tts,
          channel: channelInsert,
          nonce: sent.nonce as any,
          editedTimestamp: sent.editedTimestamp,
          deleted: false,
          webhookId: sent.webhookId,
          applicationId: sent.applicationId,
          flags: sent.flags as any,
        });
      } catch (error) {
        console.log("Error : ", error);
      }
      // botPing : work when bot send quiz wfh user
      //* isSendQuiz : work when bot send quiz
      if (botPing && isSendQuiz) {
        userdb.last_bot_message_id = sent.id;
        userdb.botPing = true;
      }
      if (!botPing && isSendQuiz) {
        userdb.last_bot_message_id = sent.id;
      }

      await this.replaceDataUser(userdb);
      return user;
    } catch (error) {
      console.log("error", error);
      const userDb = await this.userRepository
        .createQueryBuilder()
        .where('"email" = :username and deactive IS NOT True ', {
          username: username,
        })
        .orWhere('"username" = :username and deactive IS NOT True ', {
          username: username,
        })
        .select("*")
        .getRawOne()
        .catch(console.error);

      const message = `KOMU không gửi được tin nhắn cho <@${userDb.userId}>(${userDb.email}). Hãy ping <@${this.clientConfig.komubotrestAdminId}> để được hỗ trợ nhé!!!`;
      await (client.channels.cache as any)
        .get(this.clientConfig.machleoChannelId)
        .send(message)
        .catch(console.error);
      const messageItAdmin = `KOMU không gửi được tin nhắn cho <@${userDb.userId}(${userDb.email})>. <@${this.clientConfig.komubotrestAdminId}> hỗ trợ nhé!!!`;
      await (client.channels.cache as any)
        .get(this.clientConfig.itAdminChannelId)
        .send(messageItAdmin)
        .catch(console.error);
      return null;
    }
  };
  sendMessageToUser = async (
    client,
    sendMessageToUserDTO: SendMessageToUserDTO,
    header,
    res
  ) => {
    if (!header || header !== this.clientConfig.komubotRestSecretKey) {
      res.status(403).send({ message: "Missing secret key!" });
      return;
    }

    if (!sendMessageToUserDTO.username) {
      res.status(400).send({ message: "username can not be empty!" });
      return;
    }

    if (!sendMessageToUserDTO.message) {
      res.status(400).send({ message: "Message can not be empty!" });
      return;
    }
    const username = sendMessageToUserDTO.username;
    const message = sendMessageToUserDTO.message;

    try {
      const user = await this.sendMessageKomuToUser(client, message, username);
      if (!user) {
        res.status(400).send({ message: "Error!" });
        return;
      }
      res.status(200).send({ message: "Successfully!" });
    } catch (error) {
      console.log("error", error);
      res.status(400).send({ message: error });
    }
  };
  sendImageCheckInToUser = async (
    client,
    sendImageCheckInToUserDTO: SendImageCheckInToUserDTO,
    header,
    res
  ) => {
    // Validate request
    if (!header || header !== this.clientConfig.komubotRestSecretKey) {
      res.status(403).send({ message: "Missing secret key!" });
      return;
    }
    if (!sendImageCheckInToUserDTO.username) {
      res.status(400).send({ message: "username can not be empty!" });
      return;
    }
    if (!sendImageCheckInToUserDTO.verifiedImageId) {
      res.status(400).send({ message: "VerifiedImageId can not be empty!" });
      return;
    }
    const verifiedImageId = sendImageCheckInToUserDTO.verifiedImageId.replace(
      / /g,
      ""
    );
    const username = sendImageCheckInToUserDTO.username;
    try {
      const user = await this.sendMessageKomuToUser(client, null, username);
      if (!user) {
        res.status(400).send({ message: "Error!" });
        return;
      }

      const path = sendImageCheckInToUserDTO.pathImage.replace(/\\/g, "/");
      if (!path) {
        res.status(400).send({ message: "Path can not be empty!" });
        return;
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("komu_checkin_yes#" + verifiedImageId)
          .setLabel("Yes")
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId("komu_checkin_no#" + verifiedImageId)
          .setLabel("No")
          .setStyle(2)
      );

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Bạn vừa check-in thành công!")
        .setURL("https://komu.vn")
        .setImage("attachment://checkin.jpg")
        .setDescription("Đây có phải là bạn không?");

      await user.send({
        embeds: [embed],
        files: [path],
        components: [row as any],
      });
      res.status(200).send({ message: "Successfully!" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(400).send({ message: error });
    }
  };
  sendImageLabelToUser = async (
    client,
    sendImageLabelToUserDTO: SendImageLabelToUserDTO,
    header,
    res
  ) => {
    if (!header || header !== this.clientConfig.komubotRestSecretKey) {
      res.status(403).send({ message: "Missing secret key!" });
      return;
    }
    if (!sendImageLabelToUserDTO.username) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    if (!sendImageLabelToUserDTO.imageLabelId) {
      res.status(400).send({ message: "ImageLabelId can not be empty!" });
      return;
    }
    const imagelabel = sendImageLabelToUserDTO.imageLabelId.replace(/ /g, "");
    const username = sendImageLabelToUserDTO.username;
    try {
      const user = await this.sendMessageKomuToUser(client, null, username);
      if (!user) {
        res.status(400).send({ message: "Error!" });
        return;
      }

      const path = sendImageLabelToUserDTO.pathImage.replace(/\\/g, "/");
      let messages = "";
      let label1 = "";
      let label2 = "";
      if (sendImageLabelToUserDTO.questionType == "VERIFY_EMOTION") {
        messages = "Cảm xúc của người trong ảnh là gì?";
        label1 = "Good";
        label2 = "Bad";
      } else {
        messages = "Đây có phải là bạn không?";
        label1 = "Yes";
        label2 = "No";
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("komu_wfh_lbl1#" + imagelabel)
          .setLabel(label1)
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId("komu_wfh_lbl2#" + imagelabel)
          .setLabel(label2)
          .setStyle(2)
      );

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Bạn hãy trả lời tin nhắn WFH!")
        .setURL("https://komu.vn")
        .setImage("attachment://checkin.jpg")
        .setDescription(messages);

      await user.send({
        embeds: [embed],
        files: [path],
        components: [row as any],
      });
      res.status(200).send({ message: "Successfully!" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(400).send({ message: error });
    }
  };
  sendMessageToChannel = async (
    client,
    sendMessageToChannelDTO: SendMessageToChannelDTO,
    header,
    res
  ) => {
    if (!header || header !== this.clientConfig.komubotRestSecretKey) {
      res.status(403).send({ message: "Missing secret key!" });
      return;
    }

    if (!sendMessageToChannelDTO.channelid) {
      res.status(400).send({ message: "ChannelId can not be empty!" });
      return;
    }

    if (!sendMessageToChannelDTO.message) {
      res.status(400).send({ message: "Message can not be empty!" });
      return;
    }
    let message = sendMessageToChannelDTO.message;
    const channelid = sendMessageToChannelDTO.channelid;

    if (
      sendMessageToChannelDTO.machleo &&
      sendMessageToChannelDTO.machleo_userid != undefined
    ) {
      message = this.getWFHWarninghMessage(
        message,
        sendMessageToChannelDTO.machleo_userid,
        sendMessageToChannelDTO.wfhid
      ) as any;
    }

    try {
      const channel = await client.channels.fetch(channelid);
      await channel.send(message);
      res.status(200).send({ message: "Successfully!" });
    } catch (error) {
      console.log("error", error);
      res.status(400).send({ message: error });
    }
  };
  getWFHWarninghMessage = (content, userId, wfhId) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("komu_wfh_complain#" + userId + "#" + wfhId)
        .setLabel("I'am in daily call")
        .setEmoji("⏳")
        .setStyle(4),
      new ButtonBuilder()
        .setCustomId("komu_wfh_accept#" + userId + "#" + wfhId)
        .setLabel("Accept")
        .setEmoji("✍")
        .setStyle(1)
    );
    return { content, components: [row] };
  };
  sendMessageToMachLeo = async (
    client,
    sendMessageToChannelDTO: SendMessageToChannelDTO,
    header,
    res
  ) => {
    sendMessageToChannelDTO.channelid = this.clientConfig.machleoChannelId;
    if (!sendMessageToChannelDTO.username) {
      res.status(400).send({ message: "username can not be empty!" });
      return;
    }
    if (!sendMessageToChannelDTO.createdate) {
      res.status(400).send({ message: "createdate can not be empty!" });
      return;
    }
    const userdb = await this.findUserData(sendMessageToChannelDTO.username);
    let userid: number;
    sendMessageToChannelDTO.message = `không trả lời tin nhắn WFH lúc ${sendMessageToChannelDTO.createdate} !\n`;

    if (!userdb) {
      console.log("User not found in DB!", sendMessageToChannelDTO.username);
      sendMessageToChannelDTO.message += `<@${this.clientConfig.komubotrestAdminId}> ơi, đồng chí ${sendMessageToChannelDTO.username} không đúng format rồi!!!`;
      userid = sendMessageToChannelDTO.username as any;
    } else {
      sendMessageToChannelDTO.machleo_userid = userdb.userId;
      userid = userdb.userId as any;
    }

    sendMessageToChannelDTO.message =
      `<@${userid}>` + sendMessageToChannelDTO.message;
    sendMessageToChannelDTO.machleo = true;

    // store to db
    try {
      this.data = await this.insertDataToWFH(
        userid,
        sendMessageToChannelDTO.message,
        false,
        false,
        "ACTIVE"
      );
    } catch (err) {
      console.log("Error: ", err);
      res.status(400).send({ message: err });
    }
    sendMessageToChannelDTO.wfhid = this.data.id.toString();
    await this.sendMessageToChannel(
      client,
      sendMessageToChannelDTO,
      header,
      res
    );
  };
  sendMessageToThongBaoPM = async (
    client,
    sendMessageToChannelDTO: SendMessageToChannelDTO,
    header,
    res
  ) => {
    sendMessageToChannelDTO.channelid =
      this.clientConfig.komubotRestThongBaoPmChannelId;
    await this.sendMessageToChannel(
      client,
      sendMessageToChannelDTO,
      header,
      res
    );
  };
  sendMessageToThongBao = async (
    client,
    sendMessageToChannelDTO: SendMessageToChannelDTO,
    header,
    res
  ) => {
    sendMessageToChannelDTO.channelid =
      this.clientConfig.komubotRestThongBaoChannelId;
    await this.sendMessageToChannel(
      client,
      sendMessageToChannelDTO,
      header,
      res
    );
  };
  sendMessageToFinance = async (
    client,
    sendMessageToChannelDTO: SendMessageToChannelDTO,
    header,
    res
  ) => {
    sendMessageToChannelDTO.channelid =
      this.clientConfig.komubotRestFinanceChannelId;
    await this.sendMessageToChannel(
      client,
      sendMessageToChannelDTO,
      header,
      res
    );
  };
  sendMessageKomuToUserOrNull = async (client, msg) => {
    await client.channels.cache
      .get(this.clientConfig.komubotRestNhacuachungChannelId)
      .send(msg)
      .catch(console.error);
    return null;
  };
  sendErrorToMachLeo = async (client, userid, err) => {
    const msg = `KOMU không gửi được tin nhắn cho <@${userid}> message: ${err.message} httpStatus: ${err.httpStatus} code: ${err.code}.`;
    await client.channels.cache
      .get(this.clientConfig.machleoChannelId)
      .send(msg)
      .catch(console.error);
    return null;
  };
  sendErrorToDevTest = async (client, authorId, err) => {
    const msg = `KOMU không gửi được tin nhắn cho <@${authorId}> message: ${err.message} httpStatus: ${err.httpStatus} code: ${err.code}.`;
    await client.channels.cache
      .get(this.clientConfig.komubotRestDevtestChannelId)
      .send(msg)
      .catch(console.error);
    return null;
  };
  sendMessageToChannelById = async (client, channelId, msg) => {
    try {
      const channel = await client.channels.fetch(channelId);
      await channel.send(msg);
    } catch (error) {
      console.log(error);
    }
  };
  sendMessageToNhaCuaChung = async (client, msg) => {
    await client.channels.cache
      .get(this.clientConfig.komubotRestNhacuachungChannelId)
      .send(msg)
      .catch(console.error);
    return null;
  };
  sendEmbedMessage = async (
    client,
    sendEmbedMessageDTO: SendEmbedMessageDTO,
    header,
    res
  ) => {
    try {
      if (
        // KOMUBOTREST_KOMU_BOT_SECRET_KEY
        !header ||
        header !== this.clientConfig.komubotRestSecretKey
      ) {
        res.status(403).send({ message: "Missing secret key!" });
        return;
      }
      if (!sendEmbedMessageDTO.title) {
        res.status(400).send({ message: "title can not be empty!" });
        return;
      }
      if (!sendEmbedMessageDTO.description) {
        res.status(400).send({ message: "decription can not be empty!" });
        return;
      }
      if (!sendEmbedMessageDTO.image) {
        res.status(400).send({ message: "image can not be empty!" });
        return;
      }
      const embed = (title, des, image) =>
        new EmbedBuilder()
          .setTitle(title)
          .setDescription(des)
          .setColor(0xed4245)
          .setImage(image);

      const { title, description, image } = sendEmbedMessageDTO;
      let isSendChannel = false;
      let isSendAllUser = false;
      let isSendUserAndChannel = false;
      let isSendUser = false;
      if (!sendEmbedMessageDTO.channelId && !sendEmbedMessageDTO.userId) {
        isSendAllUser = true;
      } else if (sendEmbedMessageDTO.channelId && sendEmbedMessageDTO.userId) {
        isSendUserAndChannel = true;
      } else if (!sendEmbedMessageDTO.channelId) {
        isSendUser = true;
      } else if (!sendEmbedMessageDTO.userId) {
        isSendChannel = true;
      }
      if (isSendUserAndChannel) {
        const channelId = sendEmbedMessageDTO.channelId;
        const userId = sendEmbedMessageDTO.userId;
        await this.sendMessageToChannelById(client, channelId, {
          embeds: [embed(title, description, image)],
        });
        const { ...user } = await this.findUserOne(userId);
        await this.sendMessageKomuToUser(
          client,
          { embeds: [embed(title, description, image)] },
          user.username
        );
        res.send({ message: "Send message to user and channel successfully!" });
      } else if (isSendChannel) {
        const channelId = sendEmbedMessageDTO.channelId;
        await this.sendMessageToChannelById(client, channelId, {
          embeds: [embed(title, description, image)],
        });
        res.send({ message: "Send message to channel success!" });
      } else if (isSendAllUser) {
        // const users = await userData.find({}).select('username -_id');
        const users = await this.findAllUser();
        await Promise.all(
          users.map((user) =>
            this.sendMessageKomuToUser(
              client,
              { embeds: [embed(title, description, image)] },
              user.username
            )
          )
        );
        res.send({ message: "Send message to all user successfully!" });
      } else if (isSendUser) {
        const userId = sendEmbedMessageDTO.userId;
        const { ...user } = await this.findUserOne(userId);
        // const user = await userData
        //   .findOne({ id: userId })
        //   .select('-_id username');
        await this.sendMessageKomuToUser(
          client,
          { embeds: [embed(title, description, image)] },
          user.username
        );
        res.send({ message: "Send message to user successfully!" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  async getInfoUserByEmail(getUserIdByEmailDTO: GetUserIdByEmailDTO) {
    return await this.userRepository.find({
      where: {
        email: getUserIdByEmailDTO.email,
      },
    });
  }
}
