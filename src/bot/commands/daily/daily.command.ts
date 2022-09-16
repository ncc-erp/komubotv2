import { Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { sendErrorToDevTest } from "src/bot/untils/komu.until";
import { DailyService } from "./daily.service";

const messHelp =
  "```" +
  "Please daily follow this template" +
  "\n" +
  "*daily [projectCode] [date]" +
  "\n" +
  "- yesterday: what you have done yesterday" +
  "\n" +
  "- today: what you're going to to today; 2h" +
  "\n" +
  "- block: thing that block you " +
  "\n\n" +
  "*daily help for more details" +
  "```";

const dailyHelp =
  "```" +
  "Daily meeting note, recap your daily work items and log timesheet automatically." +
  "\n" +
  "Please daily follow this template:" +
  "\n\n" +
  "*daily [projectCode] [date]" +
  "\n" +
  "- yesterday: what you have done yesterday" +
  "\n" +
  "- today: what you're going to to today; 2h" +
  "\n" +
  "- block: thing that block you" +
  "\n\n" +
  "Tips:" +
  "\n" +
  "- Today message will be log to timesheet automatically" +
  "\n" +
  "- Make sure that you checked the default task on timesheet tool" +
  "\n" +
  "- If no project code provided de default project will be used" +
  "\n" +
  "- Your projects can be listed by *userinfo or *timesheet help" +
  "\n" +
  "- Date accepting format dd/mm/yyy" +
  "\n" +
  "- If no time provided the timesheet will be created with 1h by default" +
  "\n" +
  "- Please review your timesheet to make sure that the information are correct" +
  "\n" +
  "- You can log multiple task for a project splitting by +" +
  "\n" +
  "- If you want to daily for multiple project please use *daily multiple times" +
  "```";

@CommandLine({
  name: "daily",
  description: "daily work",
})
export class DailyCommand implements CommandLineClass {
  constructor(private readonly dailyService: DailyService) {}

  async execute(message: Message, args, client) {
    const authorId = message.author.id;
    if (args[0] === "help") {
      return this.help(message, args, client);
    }

    try {
      const daily = args.join(" ");
      if (!daily || daily == undefined) {
        return message.reply({
          content: "```please add your daily text```",
          ephemeral: true,
        } as any);
      }
      this.checkDaily(message, args, client);
      if (daily.length < 100) {
        return message
          .reply({
            content:
              "```Please enter at least 100 characters in your daily text```",
            ephemeral: true,
          } as any)
          .catch((err) => {
            sendErrorToDevTest(client, authorId, err);
          });
      } else {
        await this.dailyService.saveDaily(message, args);
        return message.reply({
          content: "`✅` Daily saved.",
          ephemeral: true,
        } as any);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async help(message: Message, args, client) {
    return message.reply({ content: dailyHelp, ephemeral: true } as any);
  }

  async detail(message: Message, args, client) {
    return message.reply({ content: messHelp, ephemeral: true } as any);
  }

  async checkDaily(message: Message, args, client) {
    let checkDaily = false;
    const daily = args.join(" ");
    const wordInString = (s, word) =>
      new RegExp("\\b" + word + "\\b", "i").test(s);
    ["yesterday", "today", "block"].forEach((q) => {
      if (!wordInString(daily, q)) return (checkDaily = true);
    });

    if (checkDaily) {
      return message.reply({
        content: messHelp,
        ephemeral: true,
      } as any);
    }
  }
}
