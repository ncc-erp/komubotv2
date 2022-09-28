import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ActionRowBuilder,
  ButtonBuilder,
  Client,
  EmbedBuilder,
} from "discord.js";
import { TABLE } from "src/bot/constants/table";
import { Msg } from "src/bot/models/msg.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { Brackets, Repository } from "typeorm";

@Injectable()
export class KomubotrestService {
  constructor(
    @InjectRepository(User)
    private userReposistory: Repository<User>,
    @InjectRepository(Msg)
    private messageReposistory: Repository<Msg>,
    @InjectRepository(WorkFromHome)
    private wfhReposistory: Repository<WorkFromHome>
  ) {}
  private data;
  async findUserData(_pramams) {
    return await this.userReposistory
      .createQueryBuilder(TABLE.USER)
      .where(
        new Brackets((qb) => {
          qb.where(`${TABLE.USER}.email = :email`, {
            email: _pramams,
          }).andWhere(`${TABLE.USER}.deactive = :deactive`, {
            deactive: false,
          });
        })
      )
      .orWhere(
        new Brackets((qb) => {
          qb.where(`${TABLE.USER}.username = :username`, {
            username: _pramams,
          }).andWhere(`${TABLE.USER}.deactive = :deactive`, {
            deactive: false,
          });
        })
      )
      .getOne();
  }
  async insertNewMsg(sent) {
    return await this.messageReposistory
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
    return await this.messageReposistory
      .createQueryBuilder()
      .insert()
      .into(TABLE.USER)
      .values([])
      .execute();
  }
  async insertDataToWFH(_userid, _wfhMsg, _complain, _pmconfirm, _status) {
    return await this.wfhReposistory
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
  async findUserOne(_id) {
    return await this.userReposistory
      .createQueryBuilder(TABLE.USER)
      .where(`${TABLE.USER}.id = :id`, {
        id: _id,
      })
      .getOne();
  }
  async findAllUser() {
    return await this.userReposistory.createQueryBuilder(TABLE.USER).getMany();
  }
  getUserIdByUsername = async (client, req, res) => {
    if (
      !req.get("X-Secret-Key") ||
      req.get("X-Secret-Key") !== process.env.KOMUBOTREST_KOMU_BOT_SECRET_KEY
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
    client,
    msg,
    username,
    botPing = false,
    isSendQuiz = false
  ) => {
    try {
      console.log(username, msg);

      const userdb = await this.userReposistory
        .createQueryBuilder("users")
        .where('"email" = :username and deactive IS NOT True ', {
          username: username,
        })
        .where('"username" = :username and deactive IS NOT True ', {
          username: username,
        })
        .select("users.*")
        .execute()
        .catch(console.error);
      userdb.forEach((item) => console.log(item, "fdsfdsfssdfsdgjlsn"));
      if (!userdb) {
        return null;
      }
      const user = await client.users
        .fetch(userdb[0].userId)
        .catch(console.error);
      if (msg == null) {
        return user;
      }
      if (!user) {
        // notify to machleo channel
        const message = `<@${process.env.KOMUBOTREST_ADMIN_USER_ID}> ơi, đồng chí ${username} không đúng format rồi!!!`;
        await client.channels.cache
          .get(process.env.KOMUBOTREST_MACHLEO_CHANNEL_ID)
          .send(message)
          .catch(console.error);
        return null;
      }
      const sent = await user.send(msg);
      console.log(sent, "fdsgfsdgsdgdsgsdgsdggsdggdsgsdgdsdggsgsđ");
      await this.messageReposistory.insert({
        author: sent.username,
        channelId:'1021944210800263189',
        deleted:false,
      });
      // botPing : work when bot send quiz wfh user
      // isSendQuiz : work when bot send quiz
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
      const userDb = await this.userReposistory
        .createQueryBuilder("users")
        .where('"email" = :username and deactive IS NOT True ', {
          username: username,
        })
        .where('"username" = :username and deactive IS NOT True ', {
          username: username,
        })
        .select("users.*")
        .execute()
        .catch(console.error);
      userDb.forEach((item) => console.log(item, "fdsfdsfssdfsdgjlsn"));

      const message = `KOMU không gửi được tin nhắn cho <@${userDb[0].userId}>(${userDb[0].email}). Hãy ping <@${process.env.KOMUBOTREST_ADMIN_USER_ID}> để được hỗ trợ nhé!!!`;
      await client.channels.cache
        .get(process.env.KOMUBOTREST_MACHLEO_CHANNEL_ID)
        .send(message)
        .catch(console.error);
      const messageItAdmin = `KOMU không gửi được tin nhắn cho <@${userDb[0].userId}(${userDb[0].email})>. <@${process.env.KOMUBOTREST_ADMIN_USER_ID}> hỗ trợ nhé!!!`;
      await client.channels.cache
        .get(process.env.KOMUBOTREST_ITADMIN_CHANNEL_ID)
        .send(messageItAdmin)
        .catch(console.error);
      return null;
    }
  };
  sendMessageToUser = async (client, req, res) => {
    if (
      !req.get("X-Secret-Key") ||
      req.get("X-Secret-Key") !== process.env.KOMUBOTREST_KOMU_BOT_SECRET_KEY
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
      req.get("X-Secret-Key") !== process.env.KOMUBOTREST_KOMU_BOT_SECRET_KEY
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

      await user.send({ embeds: [embed], files: [path], components: [row] });
      res.status(200).send({ message: "Successfully!" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(400).send({ message: error });
    }
  };
  sendImageLabelToUser = async (client, req, res) => {
    if (
      !req.get("X-Secret-Key") ||
      req.get("X-Secret-Key") !== process.env.KOMUBOTREST_KOMU_BOT_SECRET_KEY
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

      await user.send({ embeds: [embed], files: [path], components: [row] });
      res.status(200).send({ message: "Successfully!" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(400).send({ message: error });
    }
  };
  sendMessageToChannel = async (client, req, res) => {
    if (
      !req.get("X-Secret-Key") ||
      req.get("X-Secret-Key") !== process.env.KOMUBOTREST_KOMU_BOT_SECRET_KEY
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
    req.body.channelid = process.env.KOMUBOTREST_MACHLEO_CHANNEL_ID;
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
      req.body.message += `<@${process.env.KOMUBOTREST_ADMIN_USER_ID}> ơi, đồng chí ${req.body.username} không đúng format rồi!!!`;
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
    req.body.channelid = process.env.KOMUBOTREST_THONGBAO_PM_CHANNEL_ID;
    await this.sendMessageToChannel(client, req, res);
  };
  sendMessageToThongBao = async (client, req, res) => {
    req.body.channelid = process.env.KOMUBOTREST_THONGBAO_CHANNEL_ID;
    await this.sendMessageToChannel(client, req, res);
  };
  sendMessageToFinance = async (client, req, res) => {
    req.body.channelid = process.env.KOMUBOTREST_FINANCE_CHANNEL_ID;
    await this.sendMessageToChannel(client, req, res);
  };
  sendMessageKomuToUserOrNull = async (client, msg) => {
    await client.channels.cache
      .get(process.env.KOMUBOTREST_NHACUACHUNG_CHANNEL_ID)
      .send(msg)
      .catch(console.error);
    return null;
  };
  sendErrorToMachLeo = async (client, userid, err) => {
    const msg = `KOMU không gửi được tin nhắn cho <@${userid}> message: ${err.message} httpStatus: ${err.httpStatus} code: ${err.code}.`;
    await client.channels.cache
      .get(process.env.KOMUBOTREST_MACHLEO_CHANNEL_ID)
      .send(msg)
      .catch(console.error);
    return null;
  };
  sendErrorToDevTest = async (client, authorId, err) => {
    const msg = `KOMU không gửi được tin nhắn cho <@${authorId}> message: ${err.message} httpStatus: ${err.httpStatus} code: ${err.code}.`;
    await client.channels.cache
      .get(process.env.KOMUBOTREST_DEVTEST_CHANNEL_ID)
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
      .get(process.env.KOMUBOTREST_NHACUACHUNG_CHANNEL_ID)
      .send(msg)
      .catch(console.error);
    return null;
  };
  sendEmbedMessage = async (client, req, res) => {
    try {
      if (
        !req.get("X-Secret-Key") ||
        req.get("X-Secret-Key") !== process.env.KOMUBOTREST_KOMU_BOT_SECRET_KEY
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
  async deleteMessage(client, req, res) {
    try {
      const fetchMessage = await client.channels.fetch(req.body.channelId);
      const msg = await fetchMessage.messages
        .fetch(req.body.messageId)
        .catch((err) => {});
      if (msg) msg.delete();
      res.status(200).send({ message: "Successfully!" });
    } catch (error) {
      console.log(error);
    }
  }
}
