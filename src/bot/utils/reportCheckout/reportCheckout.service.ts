import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { intervalToDuration } from "date-fns";
import { EmbedBuilder } from "discord.js";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { getUserOffWork } from "../getUserOffWork";
import { firstValueFrom } from "rxjs";
import { UtilsService } from "../utils.service";

@Injectable()
export class ReportCheckoutService {
  constructor(
    private utilsService: UtilsService,
    private clientConfigService: ClientConfigService,
    private readonly http: HttpService
  ) {}

  messHelp =
    "```" +
    "*report ts" +
    "\n" +
    "*report ts dd/mm/yyyy" +
    "\n" +
    "*report ts weekly" +
    "```";

  showTrackerTime(spentTime) {
    const duration = intervalToDuration({
      start: 0,
      end: spentTime * 1000 * 60,
    });
    return `${duration.hours}h ${duration.minutes}m ${duration.seconds}s`;
  }

  dateCalculate = async (lists, date) => {
    const result = [];
    const dateCheck = new Date(date);
    const { userOffFullday } = date
      ? await getUserOffWork(dateCheck)
      : await getUserOffWork(null);

    lists.map((list) => {
      list.listDate.map((item) => {
        const timeWork = item.timeSheetMinute - item.checkOutInMinute;
        const email = this.utilsService.getUserNameByEmail(list.emailAddress);
        if (timeWork > 30 && !userOffFullday.includes(email)) {
          result.push({
            email: email,
            time: timeWork,
          });
        }
      });
    });

    return result;
  };

  async reportCheckout(message, args, client) {
    if (!args[1]) {
      try {
        const lists = await firstValueFrom(
          this.http
            .get(
              `${
                this.clientConfigService.checkinTimesheet.api_url
              }?startDate=${this.utilsService.getyesterdaydate()}&endDate=${this.utilsService.getyesterdaydate()}`
            )
            .pipe((res) => res)
        );
        const checkTimesheet = await this.dateCalculate(
          lists.data.result,
          this.utilsService.getyesterdaydate()
        );

        let mess;
        if (!checkTimesheet) {
          return;
        } else if (
          Array.isArray(checkTimesheet) &&
          checkTimesheet.length === 0
        ) {
          mess = "```" + "Không có ai vi phạm" + "```";
          return message.reply(mess).catch(console.error);
        } else {
          for (let i = 0; i <= Math.ceil(checkTimesheet.length / 50); i += 1) {
            if (checkTimesheet.slice(i * 50, (i + 1) * 50).length === 0) break;
            mess = checkTimesheet
              .slice(i * 50, (i + 1) * 50)
              .map(
                (list) =>
                  `<${list.email}> chênh lệch ${this.showTrackerTime(
                    list.time
                  )}`
              )
              .join("\n");
            const Embed = new EmbedBuilder()
              .setTitle("Danh sách vi phạm")
              .setColor("Red")
              .setDescription(`${mess}`);
            await message.reply({ embeds: [Embed] }).catch(console.error);
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else if (args[1] === "help") {
      await message
        .reply({
          content: this.messHelp,
          ephemeral: true,
        })
        .catch(console.error);
    } else if (args[1] === "weekly") {
      const dateMondayToSFriday = [];
      const current = new Date();
      const first = current.getDate() - current.getDay();
      for (let i = 1; i < 6; i++) {
        const next = new Date(current.getTime());
        next.setDate(first + i);
        const date = new Date(next).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        dateMondayToSFriday.push(date);
      }
      try {
        for (const itemDay of dateMondayToSFriday) {
          let startDate = itemDay.split("/");
          const formatDate =
            startDate[1] + "-" + startDate[0] + "-" + startDate[2];
          startDate = startDate[2] + "-" + startDate[0] + "-" + startDate[1];
          const lists = await firstValueFrom(
            this.http
              .get(
                `${this.clientConfigService.checkinTimesheet.api_url}?startDate=${startDate}&endDate=${startDate}`
              )
              .pipe((res) => res)
          );
          const checkTimesheet = await this.dateCalculate(lists.data.result, startDate);

          let mess;
          if (!checkTimesheet) {
            return;
          } else if (
            Array.isArray(checkTimesheet) &&
            checkTimesheet.length === 0
          ) {
            mess = "```" + "Không có ai vi phạm" + "```";
            return message.reply(mess).catch(console.error);
          } else {
            for (
              let i = 0;
              i <= Math.ceil(checkTimesheet.length / 50);
              i += 1
            ) {
              if (checkTimesheet.slice(i * 50, (i + 1) * 50).length === 0)
                break;
              mess = checkTimesheet
                .slice(i * 50, (i + 1) * 50)
                .map(
                  (list) =>
                    `<${list.email}> chênh lệch ${this.showTrackerTime(
                      list.time
                    )}`
                )
                .join("\n");
              const Embed = new EmbedBuilder()
                .setTitle(`Danh sách vi phạm ngày ${formatDate}`)
                .setColor("Red")
                .setDescription(`${mess}`);
              await message.reply({ embeds: [Embed] }).catch(console.error);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else if (args[1]) {
      let startDate = args[1].split("/");
      startDate = startDate[2] + "-" + startDate[1] + "-" + startDate[0];
      try {
        const lists = await firstValueFrom(
          this.http
            .get(
              `${this.clientConfigService.checkinTimesheet.api_url}?startDate=${startDate}&endDate=${startDate}`
            )
            .pipe((res) => res)
        );
        const checkTimesheet = await this.dateCalculate(lists.data.result, startDate);

        let mess;
        if (!checkTimesheet) {
          return;
        } else if (
          Array.isArray(checkTimesheet) &&
          checkTimesheet.length === 0
        ) {
          mess = "```" + "Không có ai vi phạm" + "```";
          return message.reply(mess).catch(console.error);
        } else {
          for (let i = 0; i <= Math.ceil(checkTimesheet.length / 50); i += 1) {
            if (checkTimesheet.slice(i * 50, (i + 1) * 50).length === 0) break;
            mess = checkTimesheet
              .slice(i * 50, (i + 1) * 50)
              .map(
                (list) =>
                  `<${list.email}> chênh lệch ${this.showTrackerTime(
                    list.time
                  )}`
              )
              .join("\n");
            const Embed = new EmbedBuilder()
              .setTitle(`Danh sách vi phạm ngày ${args[1]}`)
              .setColor("Red")
              .setDescription(`${mess}`);
            await message.reply({ embeds: [Embed] }).catch(console.error);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}
