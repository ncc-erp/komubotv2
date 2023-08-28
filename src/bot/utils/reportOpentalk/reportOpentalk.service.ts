import { InjectDiscordClient } from "@discord-nestjs/core";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, EmbedBuilder, Message } from "discord.js";
import { Opentalk } from "src/bot/models/opentalk.entity";
import { Repository } from "typeorm";
import { UtilsService } from "../utils.service";

@Injectable()
export class ReportOpenTalkService {
  constructor(
    private utilsService: UtilsService,
    @InjectRepository(Opentalk)
    private opentalkRepository: Repository<Opentalk>
  ) {}

  async reportOpentalk(message: Message) {
    try {
      const arrayUser = await this.opentalkRepository
        .createQueryBuilder("opentalks")
        .select("username")
        .addSelect('MAX("createdTimestamp")', "timeStamp")
        .andWhere(
          `"createdTimestamp" > ${
            this.utilsService.getTimeWeek(null).firstday.timestamp
          }`
        )
        .andWhere(
          `"createdTimestamp" < ${
            this.utilsService.getTimeWeek(null).lastday.timestamp
          }`
        )
        .groupBy("username")
        .execute();

      if (arrayUser.length > 0) {
        const listOpentalk = await this.opentalkRepository
          .createQueryBuilder("opentalks")
          .where('"createdTimestamp" IN (:...time_stamps)', {
            time_stamps: arrayUser.map((item) => item.timeStamp),
          })
          .select("opentalks.*")
          .execute();
        let mess: any;
        if (!listOpentalk) {
          return;
        } else if (Array.isArray(listOpentalk) && listOpentalk.length === 0) {
          mess = "```" + "Không có ai đăng kí" + "```";
          return message.reply(mess).catch(console.error);
        } else {
          for (let i = 0; i <= Math.ceil(listOpentalk.length / 50); i += 1) {
            if (listOpentalk.slice(i * 50, (i + 1) * 50).length === 0) break;
            mess = listOpentalk
              .slice(i * 50, (i + 1) * 50)
              .map((list) => `${list.username} `)
              .join("\n");
            const Embed = new EmbedBuilder()
              .setTitle(
                `Danh sách đăng kí tham gia opentalk (${listOpentalk.length})`
              )
              .setColor("Red")
              .setDescription(`${mess}`);
            await message.reply({ embeds: [Embed] }).catch(console.error);
          }
        }
      } else {
        return message.reply("Không có ai đăng kí");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
