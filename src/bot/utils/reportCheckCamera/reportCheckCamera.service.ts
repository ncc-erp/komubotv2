import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, EmbedBuilder } from "discord.js";
import { CheckCamera } from "src/bot/models/checkCamera.entity";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import { getUserOffWork } from "../getUserOffWork";
import { KomubotrestController } from "../komubotrest/komubotrest.controller";
import { UtilsService } from "../utils.service";

@Injectable()
export class ReportCheckCameraService {
  constructor(
    @InjectRepository(User)
    private userReposistory: Repository<User>,
    @InjectRepository(CheckCamera)
    private checkCameraReposistory: Repository<CheckCamera>,
    private utilsService: UtilsService,
    private komubotrestController: KomubotrestController
  ) {}

  async reportCheckCamera(message, args, client) {
    let authorId = message.author.id;
    const userCheckCamera = await this.checkCameraReposistory
      .createQueryBuilder()
      .andWhere("createdTimestamp >= :gtecreatedTimestamp", {
        gtecreatedTimestamp: this.utilsService.getYesterdayDate(),
      })
      .andWhere("createdTimestamp <= :ltecreatedTimestamp", {
        ltecreatedTimestamp: this.utilsService.getTomorrowDate(),
      })
      .select(".*")
      .execute()
      .catch(console.error);

    let userCheckCameraId;
    if (userCheckCamera) {
      userCheckCameraId = userCheckCamera.map((item) => item.userId);
    } else {
      return;
    }

    const { userOffFullday, userOffMorning } = await getUserOffWork(null);
    const userOff = [...userOffFullday, ...userOffMorning];
    const checkCameraFullday = await this.userReposistory
      .createQueryBuilder()
      .where(`"userId" NOT IN (:...userCheckCameraId)`, {
        userCheckCameraId: userCheckCameraId,
      })
      .andWhere(`"email" NOT IN (:...userOff)`, {
        userOff: userOff,
      })
      .andWhere(`"deactive" = :deactive`, { deactive: true })
      .andWhere(
        `"roles_discord" @> :CLIENT OR "roles_discord" @> :HR OR "roles_discord" @> :ADMIN`,
        {
          CLIENT: ["CLIENT"],
          HR: ["HR"],
          ADMIN: ["ADMIN"],
        }
      )
      .select(".*")
      .execute();

    let mess;
    if (!checkCameraFullday) {
      return;
    } else if (
      Array.isArray(checkCameraFullday) &&
      checkCameraFullday.length === 0
    ) {
      mess = "```" + "Không có ai vi phạm trong ngày" + "```";
      return message.reply(mess).catch((err) => {
        this.komubotrestController.sendErrorToDevTest(client, authorId, err);
      });
    } else {
      for (let i = 0; i <= Math.ceil(checkCameraFullday.length / 50); i += 1) {
        if (checkCameraFullday.slice(i * 50, (i + 1) * 50).length === 0) break;
        mess = checkCameraFullday
          .slice(i * 50, (i + 1) * 50)
          .map((checkCamera) => `${checkCamera.username}`)
          .join("\n");
        const Embed = new EmbedBuilder()
          .setTitle("Những người không bật camera trong ngày hôm nay")
          .setColor("Red")
          .setDescription(`${mess}`);
        await message.reply({ embeds: [Embed] }).catch((err) => {
          this.komubotrestController.sendErrorToDevTest(client, authorId, err);
        });
      }
    }
  }
}
