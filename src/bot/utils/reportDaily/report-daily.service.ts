import { Injectable } from "@nestjs/common";
import { EmbedBuilder } from "discord.js";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { UserNotDailyService } from "../getUserNotDaily/getUserNotDaily.service";
@Injectable()
export class ReportDailyService {
  constructor(
    private readonly userNotDailyService: UserNotDailyService,
    private komubotrestService: KomubotrestService
  ) {}

  findCountNotDaily(arr, email) {
    const users = arr.find((item) => item.email === email);
    return users ? users.count : 1;
  }
  async reportDaily(date, message, args, client, guildDB) {
    try {
      let authorId = message.author.id;
      const { notDaily, userNotDaily } =
        await this.userNotDailyService.getUserNotDaily(date);

      let mess;
      const dateString = (date && date.toDateString()) || "";
      const dailyString = date
        ? "Những Người Chưa Daily"
        : "Những Người Chưa Daily Hôm Nay";
      if (!userNotDaily) {
        return;
      } else if (Array.isArray(userNotDaily) && userNotDaily.length === 0) {
        mess = "```" + dateString + "Tất Cả Đều Đã Daily" + "```";
        return message.reply(mess).catch((err) => {
          this.komubotrestService.sendErrorToDevTest(client, authorId, err);
        });
      } else {
        for (let i = 0; i <= Math.ceil(userNotDaily.length / 50); i += 1) {
          if (userNotDaily.slice(i * 50, (i + 1) * 50).length === 0) break;
          mess = userNotDaily
            .slice(i * 50, (i + 1) * 50)
            .filter((user) => user)
            .map((user) => {
              if (user.userId) {
                return `${user.email.toLowerCase()} (${this.findCountNotDaily(
                  notDaily,
                  user.username
                )})`;
              } else {
                return `${user.email.toLowerCase()} (${this.findCountNotDaily(
                  notDaily,
                  user.username
                )})`;
              }
            })
            .join("\n");
          const Embed = new EmbedBuilder()
            .setTitle(
              `${dateString}
              ${dailyString}`
            )
            .setColor("Red")
            .setDescription(`${mess}`);
          await message.reply({ embeds: [Embed] }).catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
