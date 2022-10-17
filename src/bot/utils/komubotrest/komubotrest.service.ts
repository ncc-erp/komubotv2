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
          //? unknown props of sent
          sent,
        },
      ])
      .returning("*");
  }
  async replaceDataUser() {
    return await this.messageRepository
      .createQueryBuilder()
      .insert()
      .into(TABLE.USER)
      .values([])
      .execute();
  }
  async insertDataToWFH(_userid, _wfhMsg, _complain, _pmconfirm, _status) {
    return await this.wfhRepository
      .createQueryBuilder()
      .insert()
      .into(TABLE.WFH)
      .values({
        userid: _userid,
        wfhMsg: _wfhMsg,
        complain: _complain,
        pmconfirm: _pmconfirm,
        status: _status,
      })
      .execute();
  }
  async findUserOne(userId) {
    return await this.userRepository
      .createQueryBuilder()
      .where(`"userId" = :userId`, {
        userId: userId,
      })
      .getOne();
  }
  async findAllUser() {
    return await this.userRepository.createQueryBuilder(TABLE.USER).getMany();
  }
  getUserIdByUsername = async (client, req, res) => {
    if (
      !req.get("X-Secret-Key") ||
      req.get("X-Secret-Key") !== this.clientConfig.machleoChannelId
    ) {
      res.status(403).send({ message: "Missing secret key!" });
      return;
    }

    if (!req.body.username) {
      res.status(400).send({ message: "username can not be empty!" });
      return;
    }

    const userdb = await this.findUserData(req.body.username);
    if (!userdb) {
      res.status(400).send({ message: "User not found!" });
      return;
    }

    res
      .status(200)
      .send({ username: req.body.username, userid: userdb.userId });
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
        .createQueryBuilder("users")
        .where('"email" = :username and deactive IS NOT True ', {
          username: username,
        })
        .where('"username" = :username and deactive IS NOT True ', {
          username: username,
        })
        .select("users.*")
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
          system: sent.system,
          content: sent.content,
          pinned: sent.pinned,
          tts: sent.tts,
          channel: channelInsert,
          deleted: false,
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

      await this.replaceDataUser();
      return user;
    } catch (error) {
      console.log("error", error);
      const userDb = await this.userRepository
        .createQueryBuilder("users")
        .where('"email" = :username and deactive IS NOT True ', {
          username: username,
        })
        .where('"username" = :username and deactive IS NOT True ', {
          username: username,
        })
        .select("users.*")
        .getRawOne()
        .catch(console.error);
      userDb.forEach((item) => {});

      const message = `KOMU không gửi được tin nhắn cho <@${userDb.userId}>(${userDb.email}). Hãy ping <@${this.clientConfig.komubotrestAdminId}> để được hỗ trợ nhé!!!`;
      await (client.channels.cache as any)
        .get(this.clientConfig.machleoChannelId)
        .send(message)
        .catch(console.error);
      const messageItAdmin = `KOMU không gửi được tin nhắn cho <@${userDb.userId}(${userDb.email})>. <@${this.clientConfig.komubotrestAdminId}> hỗ trợ nhé!!!`;
      await (client.channels.cache as any)
        .get(this.clientConfig.machleoChannelId)
        .send(messageItAdmin)
        .catch(console.error);
      return null;
    }
  };
  sendMessageToUser = async (client, req, res) => {
    if (
      !req.get("X-Secret-Key") ||
      req.get("X-Secret-Key") !== this.clientConfig.komubotRestSecretKey
    ) {
      res.status(403).send({ message: "Missing secret key!" });
      return;
    }

    if (!req.body.username) {
      res.status(400).send({ message: "username can not be empty!" });
      return;
    }

    if (!req.body.message) {
      res.status(400).send({ message: "Message can not be empty!" });
      return;
    }
    const username = req.body.username;
    const message = req.body.message;

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
  sendImageCheckInToUser = async (client, req, res) => {
    // Validate request
    if (
      !req.get("X-Secret-Key") ||
      req.get("X-Secret-Key") !== this.clientConfig.komubotRestSecretKey
    ) {
      res.status(403).send({ message: "Missing secret key!" });
      return;
    }
    if (!req.body.username) {
      res.status(400).send({ message: "username can not be empty!" });
      return;
    }
    if (!req.body.verifiedImageId) {
      res.status(400).send({ message: "VerifiedImageId can not be empty!" });
      return;
    }
    const verifiedImageId = req.body.verifiedImageId.replace(/ /g, "");
    const username = req.body.username;
    try {
      const user = await this.sendMessageKomuToUser(client, null, username);
      if (!user) {
        res.status(400).send({ message: "Error!" });
        return;
      }

      const path = req.body.pathImage.replace(/\\/g, "/");
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
  sendImageLabelToUser = async (client, req, res) => {
    if (
      !req.get("X-Secret-Key") ||
      req.get("X-Secret-Key") !== this.clientConfig.komubotRestSecretKey
    ) {
      res.status(403).send({ message: "Missing secret key!" });
      return;
    }
    if (!req.body.username) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    if (!req.body.imageLabelId) {
      res.status(400).send({ message: "ImageLabelId can not be empty!" });
      return;
    }
    const imagelabel = req.body.imageLabelId.replace(/ /g, "");
    const username = req.body.username;
    try {
      const user = await this.sendMessageKomuToUser(client, null, username);
      if (!user) {
        res.status(400).send({ message: "Error!" });
        return;
      }

      const path = req.body.pathImage.replace(/\\/g, "/");
      let messages = "";
      let label1 = "";
      let label2 = "";
      if (req.body.questionType == "VERIFY_EMOTION") {
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
  sendMessageToChannel = async (client, req, res) => {
    if (
      !req.get("X-Secret-Key") ||
      req.get("X-Secret-Key") !== this.clientConfig.komubotRestSecretKey
    ) {
      res.status(403).send({ message: "Missing secret key!" });
      return;
    }

    if (!req.body.channelid) {
      res.status(400).send({ message: "ChannelId can not be empty!" });
      return;
    }

    if (!req.body.message) {
      res.status(400).send({ message: "Message can not be empty!" });
      return;
    }
    let message = req.body.message;
    const channelid = req.body.channelid;

    if (req.body.machleo && req.body.machleo_userid != undefined) {
      message = this.getWFHWarninghMessage(
        message,
        req.body.machleo_userid,
        req.body.wfhid
      );
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
  sendMessageToMachLeo = async (client, req, res) => {
    req.body.channelid = this.clientConfig.machleoChannelId;
    if (!req.body.username) {
      res.status(400).send({ message: "username can not be empty!" });
      return;
    }
    if (!req.body.createdate) {
      res.status(400).send({ message: "createdate can not be empty!" });
      return;
    }
    const userdb = await this.findUserData(req.body.username);
    let userid: number;
    req.body.message = ` không trả lời tin nhắn WFH lúc ${req.body.createdate} !\n`;

    if (!userdb) {
      console.log("User not found in DB!", req.body.username);
      req.body.message += `<@${this.clientConfig.komubotrestAdminId}> ơi, đồng chí ${req.body.username} không đúng format rồi!!!`;
      userid = req.body.username;
    } else {
      req.body.machleo_userid = userdb.userId;
      // userid = userdb.id;
    }

    req.body.message = `<@${userid}>` + req.body.message;
    req.body.machleo = true;

    // store to db
    try {
      this.data = this.insertDataToWFH(
        userid,
        req.body.message,
        false,
        false,
        "ACTIVE"
      );
    } catch (err) {
      console.log("Error: ", err);
      res.status(400).send({ message: err });
    }
    req.body.wfhid = this.data._id.toString();
    await this.sendMessageToChannel(client, req, res);
  };
  sendMessageToThongBaoPM = async (client, req, res) => {
    req.body.channelid = this.clientConfig.komubotRestThongBaoPmChannelId;
    await this.sendMessageToChannel(client, req, res);
  };
  sendMessageToThongBao = async (client, req, res) => {
    req.body.channelid = this.clientConfig.komubotRestThongBaoPmChannelId;
    await this.sendMessageToChannel(client, req, res);
  };
  sendMessageToFinance = async (client, req, res) => {
    req.body.channelid = this.clientConfig.komubotRestFinanceChannelId;
    await this.sendMessageToChannel(client, req, res);
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
  sendEmbedMessage = async (client, req, res) => {
    try {
      if (
        // KOMUBOTREST_KOMU_BOT_SECRET_KEY
        !req.get("X-Secret-Key") ||
        req.get("X-Secret-Key") !== this.clientConfig.komubotRestSecretKey
      ) {
        res.status(403).send({ message: "Missing secret key!" });
        return;
      }
      if (!req.body.title) {
        res.status(400).send({ message: "title can not be empty!" });
        return;
      }
      if (!req.body.description) {
        res.status(400).send({ message: "decription can not be empty!" });
        return;
      }
      if (!req.body.image) {
        res.status(400).send({ message: "image can not be empty!" });
        return;
      }
      const embed = (title, des, image) =>
        new EmbedBuilder()
          .setTitle(title)
          .setDescription(des)
          .setColor(0xed4245)
          .setImage(image);

      const { title, description, image } = req.body;
      let isSendChannel = false;
      let isSendAllUser = false;
      let isSendUserAndChannel = false;
      let isSendUser = false;
      if (!req.body.channelId && !req.body.userId) {
        isSendAllUser = true;
      } else if (req.body.channelId && req.body.userId) {
        isSendUserAndChannel = true;
      } else if (!req.body.channelId) {
        isSendUser = true;
      } else if (!req.body.userId) {
        isSendChannel = true;
      }
      if (isSendUserAndChannel) {
        const channelId = req.body.channelId;
        const userId = req.body.userId;
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
        const channelId = req.body.channelId;
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
        const userId = req.body.userId;
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
}
