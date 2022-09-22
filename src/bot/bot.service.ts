import { Body, HttpCode, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Raw, Repository } from "typeorm";
import { User } from "./models/user.entity";

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(User)
    public userData: Repository<User>
  ) {}

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
      .select("users.*")
      .execute();

    if (!userdb) {
      res.status(400).send({ message: "User not found!" });
      return;
    }
    res.status(200).send({ username: req.body.username, userid: userdb[0].id });
  }
  sendMessageToUser(req, res) {}
  sendMessageToChannel(req, res) {}
  sendImageCheckInToUser(req, res) {}
  sendImageLabelToUser(req, res) {}
  sendMessageToMachLeo(req, res) {}
  sendMessageToThongBao(req, res) {}
  sendMessageToThongBaoPM(req, res) {}
  sendMessageToFinance(req, res) {}
  deleteMessage(req, res) {}
  uploadFile(req, res) {}
}
