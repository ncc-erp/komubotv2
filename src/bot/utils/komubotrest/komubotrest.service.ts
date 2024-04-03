import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ChannelType,
  Client,
  EmbedBuilder,
  Message,
  User as UserDiscord,
} from "discord.js";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { TABLE } from "src/bot/constants/table";
import {
  GetListInfoUserDto,
  GetUserIdByEmailDTO,
} from "src/bot/dto/getUserIdByEmail";
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
import { Brackets, In, Repository } from "typeorm";
import { Daily } from "src/bot/models/daily.entity";
import { UtilsService } from "../utils.service";
import { Uploadfile } from "src/bot/models/uploadFile.entity";
import { ReportDailyDTO } from "./komubotrest.dto";
import { join } from "path";
import moment from "moment";

@Injectable()
export class KomubotrestService {
  constructor(
    // private clientConfigServiec : ClientConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Uploadfile)
    private uploadFileData: Repository<Uploadfile>,
    @InjectRepository(Msg)
    private messageRepository: Repository<Msg>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(WorkFromHome)
    private wfhRepository: Repository<WorkFromHome>,
    private utilsService: UtilsService,
    @InjectRepository(Daily)
    private dailyRepository: Repository<Daily>,
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
          webhookId: sent.webhookId ?? "",
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

    if (sendMessageToChannelDTO.file) {
      try {
        const channel = await client.channels.fetch(
          sendMessageToChannelDTO.channelid
        );
        await channel.send({
          content: sendMessageToChannelDTO.message,
          files: [
            {
              attachment: join(
                join(__dirname, "../../../..", "uploads/"),
                sendMessageToChannelDTO.file.filename
              ),
            },
          ],
        });
        res.status(200).send({ message: "Successfully!" });
      } catch (error) {
        console.log("error", error);
        res.status(400).send({ message: error });
      }
      return;
    }

    if (sendMessageToChannelDTO.fileUrl) {
      try {
        const channel = await client.channels.fetch(
          sendMessageToChannelDTO.channelid
        );
        await channel.send({
          content: sendMessageToChannelDTO.message,
          files: [sendMessageToChannelDTO.fileUrl],
        });
        res.status(200).send({ message: "Successfully!" });
      } catch (error) {
        console.log("error", error);
        res.status(400).send({ message: error });
      }
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
        .setLabel("I'm unable to react that time")
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

  async getUserNotDaily() {
    return await this.dailyRepository
      .createQueryBuilder("daily")
      .where(
        `"createdAt" BETWEEN ${this.utilsService.getYesterdayDate() - 86400000
        } AND ${this.utilsService.getYesterdayDate()}`
      )
      .select("daily.email")
      .execute();
  }

  async getReportUserDaily(query: ReportDailyDTO, client: Client) {
    try {
      if (query.from && query.to) {
        const dailyFullday = await this.dailyRepository
          .createQueryBuilder("daily")
          .innerJoin("komu_channel", "c", "daily.channelid = c.id")
          .where(`"createdAt" >= :gtecreatedAt`, {
            gtecreatedAt: query.from,
          })
          .andWhere(`"createdAt" <= :ltecreatedAt`, {
            ltecreatedAt: query.to,
          })
          .select(
            "daily.id, daily.userid, daily.email, daily.daily, daily.createdAt, daily.channelId, c.name"
          )
          .execute();

        const promises = dailyFullday.map(async (item) => {
          const fetchChannel = await client.channels
            .fetch(item.channelid)
            .catch((err) => {
              console.log("error", err);
            });
          if (
            (fetchChannel as any).type === ChannelType.GuildPublicThread ||
            (fetchChannel as any).type === ChannelType.GuildPrivateThread
          ) {
            const channelParent = await client.channels
              .fetch((fetchChannel as any).parentId)
              .catch((err) => { });
            if (channelParent) {
              return {
                ...item,
                parentId: (channelParent as any).id,
                parentName: (channelParent as any).name,
              };
            } else {
              return item;
            }
          } else return item;
        });
        const result = await Promise.all(promises);
        return { result };
      }
    } catch (error) { }
  }

  async downloadFile() {
    return await this.uploadFileData.find({
      order: {
        createTimestamp: "DESC",
      },
      take: 1,
    });
  }

  async jiraWebhook(client, data) {
    try {
      const channel: any = client.channels.cache.get(this.clientConfig.jiraWebhookChannelId);
      const issueKey = data.key;
      const summary = data.fields.summary;
      let sprintName = data.fields.customfield_10010;
      sprintName = sprintName && sprintName.length ? (sprintName[0]?.name || 'N/A') : 'N/A'
      const assigneeDisplayName = data.fields.assignee?.displayName || 'Unassigned';
      const projectName = data.fields.project?.name || 'N/A';
      const keyName = data.fields.project.key || "N/A";
      let boardId = data.fields.customfield_10010;
      boardId = boardId && boardId.length ? (boardId[0]?.boardId || 'N/A') : 'N/A';
      const getURL = data.self;
      const reporterDisplayName = data.fields.reporter?.displayName || 'Unknown Reporter';
      const statusName = data.fields.status?.name || 'N/A';
      const logoTrudi = "https://media.discordapp.net/attachments/1047723734250827806/1153150577761599498/280x280bb.png"
      const handleUrl = getURL.split('/rest')[0];

      const createdTimestamp = data.fields.created || Date.now();
      const timestampUpdated = data.fields.updated || Date.now();
      const currentTimestamp = Date.now();
      const timeDifferenceMs = currentTimestamp - timestampUpdated;
      const timeDifferenceHours = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
      const daysPassed = Math.floor(timeDifferenceHours / 24);
      const hoursRemaining = timeDifferenceHours % 24;
      const createdDate = new Date(createdTimestamp);
      const formattedCreatedTime = createdDate.toUTCString();

      const discord_message = new EmbedBuilder()
        .setColor('#34EBE5')
        .setTitle(`Ticket ${issueKey}: ${summary}`)
        .setDescription('Ticket has not been updated for a long time')
        .addFields(
          { name: 'Project', value: projectName, inline: false },
          { name: 'Sprint', value: sprintName, inline: true },
          { name: 'Status', value: statusName, inline: true },
          {
            name: 'Ticket has not been updated for',
            value: `${daysPassed} days and ${hoursRemaining} hours`,
            inline: false,
          },
          { name: 'Created at', value: formattedCreatedTime, inline: false },
          { name: 'Assignee', value: assigneeDisplayName, inline: true },
          { name: 'Reporter', value: reporterDisplayName, inline: true }
        )
        .setThumbnail(logoTrudi)
        .setURL(`${handleUrl}/jira/software/projects/${keyName}/boards/${boardId}/?selectedIssue=${issueKey}`);

      return channel.send({ embeds: [discord_message] });

    } catch (error) {
      console.error('Error handling Jira webhook:', error);
      throw new Error('Failed to handle Jira webhook');
    }
  }

  async bitbucketWebhook(client, data, event) {
    const channel: any = client.channels.cache.get(this.clientConfig.bitbucketWebhookChannelId);
    const branch = ["attic", "staging", "pre-prod", "master"]
    if (event == this.clientConfig.StatusBuild) {
      const commit_refname = data.commit_status.refname;
      if (branch.includes(commit_refname)) {
        const commit_state = data.commit_status.state;
        const repository_nane = data.repository.full_name;
        const author_name = data.commit_status.commit.author.user.display_name;
        const name_build = data.commit_status.name;
        const commit_message = data.commit_status.commit.message;

        if (commit_state == "SUCCESSFUL") {
          const discord_message = new EmbedBuilder()
            .setColor(5763719)
            .setTitle(name_build)
            .setDescription(
              `**Repository**: ${repository_nane} \n\n` +
              `**Author**: ${author_name}\n\n` +
              `**State**: ${commit_state}\n\n` +
              `**Branch Destination**: ${commit_refname}\n\n` +
              `**Commit Message**:${commit_message}`
            );

          return channel.send({ embeds: [discord_message] });
        } else if (commit_state == "FAILED") {
          const discord_message = new EmbedBuilder()
            .setColor(14226966)
            .setTitle(name_build)
            .setDescription(
              `**Repository**: ${repository_nane} \n\n` +
              `**Author**: ${author_name}\n\n` +
              `**State**: ${commit_state}\n\n` +
              `**Branch Destination**: ${commit_refname}\n\n` +
              `**Commit Message**:${commit_message}`
            );

          return channel.send({ embeds: [discord_message] });
        } else if (commit_state == "INPROGRESS") {
          const discord_message = new EmbedBuilder()
            .setColor(0x2771f2)
            .setTitle(name_build)
            .setDescription(
              `**Repository**: ${repository_nane} \n\n` +
              `**Author**: ${author_name}\n\n` +
              `**State**: ${commit_state}\n\n` +
              `**Branch Destination**: ${commit_refname}\n\n` +
              `**Commit Message**:${commit_message}`
            );
          return channel.send({ embeds: [discord_message] });
        } else {
          const discord_message = new EmbedBuilder()
            .setColor(0xffc923)
            .setTitle(name_build)
            .setDescription(
              `**Repository**: ${repository_nane} \n\n` +
              `**Author**: ${author_name}\n\n` +
              `**State**: ${commit_state}\n\n` +
              `**Branch Destination**: ${commit_refname}\n\n` +
              `**Commit Message**:${commit_message}`
            );

          return channel.send({ embeds: [discord_message] });
        }
      }
    } else if (event == this.clientConfig.PullRequest) {
      const branch_destination = data.pullrequest.destination.branch.name;
      if (branch.includes(branch_destination)) {
        const pull_request_title = data.pullrequest.title;
        const created_on = data.pullrequest.created_on;
        const created_on_formatted = moment(created_on).format(
          "DD--MM-YYYY h:mm:ss"
        );
        const branch_source = data.pullrequest.source.branch.name;
        const actor = data.actor.display_name;

        const reviewers = [];
        reviewers.push(actor);
        const pullRequestReviewers: any[] = data.pullrequest.participants;
        pullRequestReviewers.forEach((participants) => {
          if (participants.state == "approved") {
            const reviewer_name = participants.user.display_name;
            if (!reviewers.includes(reviewer_name)) {
              reviewers.push(reviewer_name);
            }
          }
        });
        const discord_message = new EmbedBuilder()
          .setColor(0x34ebe5)
          .setTitle(`Pull Request Merged: ${pull_request_title}`)
          .setFields(
            {
              name: "Reviewers",
              value: ` ${reviewers.join(", ")}`,
              inline: false,
            },
            { name: "Branch Source", value: branch_source, inline: false },
            {
              name: "Branch Destination",
              value: branch_destination,
              inline: false,
            },
            { name: "Created On", value: created_on_formatted, inline: false }
          );

        return channel.send({ embeds: [discord_message] });
      }
    }
  }
  async getListInfoUser(getListInfoUser: GetListInfoUserDto) {
    const emails = getListInfoUser.emails;
    if (emails.length === 0) {
      return [];
    }
    const users = await this.userRepository.find({
      select: ["userId", "email"],
      where: {
        email: In(emails),
        deactive: false,
      },
    });

    if (users.length === 0) {
      return [];
    }

    return emails.map((email) => {
      const user = users.find((u) => u.email === email);
      return {
        userId: user ? user.userId : "",
        username: user ? user.email : "",
      };
    });
  }
}
