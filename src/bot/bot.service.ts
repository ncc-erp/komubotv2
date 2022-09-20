import { Body, HttpCode, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Raw, Repository } from "typeorm";
import { Msg } from "./models/msg.entity";
import { User } from "./models/user.entity";
import { UntilService } from "./untils/until.service";

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(User)
    private userData: Repository<User>,
    @InjectRepository(Msg)
    private msgData: Repository<Msg>,
    private utilService: UntilService
  ) {}

  // sendMessageToChannel(){}

  getAll() {
    return this.userData.find();
  }
  getUserCancel(req, res) {
    req(":channelId", ":userId");
    return res.data;
  }

  async getUserIdByUsername(req, res) {
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

    const userdb = await this.userData
      .createQueryBuilder("users")
      .where(
        '"email" = :email AND "deactive" IS NOT True OR "username" = :username AND "deactive" IS NOT True',
        { email: req.body.username, username: req.body.username }
      )
      .execute();

    if (!userdb) {
      res.status(400).send({ message: "User not found!" });
      return;
    }
    res.status(200).send({ username: req.body.username, userid: userdb.id });
  }
  sendMessageToUser(req, res) {}

  async sendMessageToChannel(req, res, client) {
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
      const user = await this.utilService.sendMessageKomuToUser(
        client,
        message,
        username,
        false,
        false,
        this.userData,
        this.msgData
      );
      if (!user) {
        res.status(400).send({ message: "Error!" });
        return;
      }
      res.status(200).send({ message: "Successfully!" });
    } catch (error) {
      console.log("error", error);
      res.status(400).send({ message: error });
    }
  }
  sendImageCheckInToUser(req, res) {}
  sendImageLabelToUser(req, res) {}
  sendMessageToMachLeo(req, res) {}
  sendMessageToThongBao(req, res) {}
  sendMessageToThongBaoPM(req, res) {}
  sendMessageToFinance(req, res) {}
  deleteMessage(req, res) {}
}
