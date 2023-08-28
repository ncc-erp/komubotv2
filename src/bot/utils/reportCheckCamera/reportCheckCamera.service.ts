import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, EmbedBuilder, Message } from "discord.js";
import { CheckCamera } from "src/bot/models/checkCamera.entity";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import { getUserOffWork } from "../getUserOffWork";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { UtilsService } from "../utils.service";

@Injectable()
export class ReportCheckCameraService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CheckCamera)
    private checkCameraRepository: Repository<CheckCamera>,
    private utilsService: UtilsService,
    private komubotrestService: KomubotrestService
  ) {}

  async reportCheckCamera(message: Message, args, client: Client) {
    let authorId = message.author.id;
    const userCheckCamera = await this.checkCameraRepository
      .createQueryBuilder()
      .andWhere(`"createdTimestamp" >= :gtecreatedTimestamp`, {
        gtecreatedTimestamp: this.utilsService.getYesterdayDate(),
      })
      .andWhere(`"createdTimestamp" <= :ltecreatedTimestamp`, {
        ltecreatedTimestamp: this.utilsService.getTomorrowDate(),
      })
      .select("*")
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

    const checkCameraFullday = await this.userRepository
      .createQueryBuilder()
      .where(
        userCheckCameraId && userCheckCameraId.length > 0
          ? `"userId" NOT IN (:...userCheckCameraId)`
          : "true",
        {
          userCheckCameraId: userCheckCameraId,
        }
      )
      .andWhere(
        userOff && userOff.length > 0 ? `"email" NOT IN (:...userOff)` : "true",
        {
          userOff: userOff,
        }
      )
      .andWhere('"deactive" IS NOT True')
      .andWhere(
        "NOT roles_discord @> array['CLIENT'] AND NOT roles_discord @> array['HR'] AND NOT roles_discord @> array['ADMIN']"
      )
      .select("*")
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
        this.komubotrestService.sendErrorToDevTest(client, authorId, err);
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
          this.komubotrestService.sendErrorToDevTest(client, authorId, err);
        });
      }
    }
  }
}
