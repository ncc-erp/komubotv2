import { EmbedBuilder } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { RequestOrder } from "src/bot/utils/requestorder.utils";
import { ElsaService } from "./elsa.service";


@CommandLine({
  name: "elsa",
  description: "Elsa daily english group",
})
export class ElsaCommand implements CommandLineClass {
  constructor(
    private timeDiscord: RequestOrder,
    private elsaService: ElsaService
  ) {}

  getTimeWeekMondayToSunday(dayNow) {
    const curr = new Date();
    const currentWeekDay = curr.getDay();
    const lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
    const firstweek = new Date(
      new Date(curr).setDate(curr.getDate() - lessDays)
    );
    const arrayDay = Array.from(
      { length: 9 - dayNow - 1 },
      (v, i) => i + dayNow + 1
    );

    function getDayofWeek(rank) {
      return new Date(
        new Date(firstweek).setDate(firstweek.getDate() + rank - 2)
      );
    }
    return arrayDay.map((item) => getDayofWeek(item));
  }
  async execute(message, args, client, guildDB) {
    try {
      if (args[0] === "weekly") {
        const daily = args.join(" ");
        console.log('args : ', args)
        console.log('daily : ', daily)
        if (!daily || daily == undefined) {
    
          return message
            .reply({
              content: "```please add your daily text```",
              ephemeral: true,
            })
            .catch(console.error);
        }
        this.getTimeWeekMondayToSunday(new Date().getDay()).map(
          async (item) => {
            await this.elsaService.createElsaDailyData(message.author.id, message.member != null || message.member != undefined
              ? message.member.displayName
              : message.author.username, daily,item,false,message.channel.id);
          }
        );
        message.reply({
          content: "`✅` Daily elsa weekly saved.",
          ephemeral: true,
        });
      } else if (args[0] === "day") {
        const daily = args.join(" ");
        if (!daily || daily == undefined) {
          return message
            .reply({
              content: "```please add your daily text```",
              ephemeral: true,
            })
            .catch(console.error);
        }
        try {
          await this.elsaService.addElsaDailyData(
            message.author.id,
            message.member != null || message.member != undefined
              ? message.member.displayName
              : message.author.username,
            daily,
            new Date(),
            false,
            message.channel.id
          );
        } catch (error) {
          console.log(error);
        }
        message.reply({
          content: "`✅` Daily elsa day saved.",
          ephemeral: true,
        });
      } else if (args[0] === "report") {
        // let report = await elsaDailyData.find({
        //     attachment: false,
        //     createdAt: { $gte: this.timeDiscord.getYesterdayDate(), $lte: this.timeDiscord.getTomorrowDate() },
        //   });
        const report = await this.elsaService.findReport(false, {
          $gte: this.timeDiscord.getYesterdayDate(),
          $lte: this.timeDiscord.getTomorrowDate(),
        });
        let mess;
        if (!report) {
          return;
        } else if (Array.isArray(report) && report.length === 0) {
          mess = "```" + "No violation for the day" + "```";
          return message.channel.send(mess).catch(console.error);
        } else {
          for (let i = 0; i <= Math.ceil(report.length / 50); i += 1) {
            if (report.slice(i * 50, (i + 1) * 50).length === 0) break;
            mess = report
              .slice(i * 50, (i + 1) * 50)
              .map((elsa) => `<@${elsa.userid}> `)
              .join("\n");
            const Embed = new EmbedBuilder()
              .setTitle(`Those who haven't submitted their homework today`)
              .setColor(0xed4245)
              .setDescription(`${mess}`);
            return message.reply({ embeds: [Embed] }).catch(console.error);
          }
        }
      } else if (args[0] === "daily") {
        const links = [];

        message.attachments.forEach((attachment) => {
          try {
            const imageLink = attachment.proxyURL;
            links.push(imageLink);
          } catch (error) {
            console.error(error);
          }
        });
        if (links.length > 0) {
          try {
            await this.elsaService.updateOneDaily(
              message.author.id,
              {
                $gte: this.timeDiscord.getYesterdayDate(),
                $lte: this.timeDiscord.getTomorrowDate(),
              },
              true
            );
          } catch (error) {
            console.log(error);
          }
          //   await elsaDailyData
          //     .updateOne(
          //       {
          //         userid: message.author.id,
          //         createdAt: {
          //           $gte: this.timeDiscord.getYesterdayDate(),
          //           $lte: this.timeDiscord.getTomorrowDate(),
          //         },
          //       },
          //       {
          //         attachment: true,
          //       }
          //     )
          //     .catch(console.log);
          message.reply({
            content: " You have successfully submitted your assignment.",
            ephemeral: true,
          });
        }
      } else if (args[0] === "help") {
        return message.channel
          .send(
            "```" +
              "*elsa options" +
              "\n" +
              "options  " +
              "\n" +
              [
                { name: "weekly", des: "daily weekly" },
                { name: "day", des: "daily today" },
                { name: "report", des: "show daily" },
                { name: "daily", des: "submit homeworks" },
              ]
                .map((item) => `- ${item.name} : ${item.des}`)
                .join("\n") +
              "```"
          )
          .catch(console.error);
      } else {
        return message.channel
          .send("```" + "*elsa help" + "```")
          .catch(console.error);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
