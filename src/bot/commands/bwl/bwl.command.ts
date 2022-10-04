import { EmbedBuilder } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { firstValueFrom } from "rxjs";
import { getUserOffWork } from "src/bot/utils/getUserOffWork";
import { UtilsService } from "src/bot/utils/utils.service";
import { BWLService } from "./bwl.service";

@CommandLine({
  name: "bwl",
  description: "BWL leaderboard",
  cat: "komu",
})
export class BWLCommand implements CommandLineClass {
  constructor(private utilsService: UtilsService,    private bwlService : BWLService,) {}

  async execute(message, args) {
    try {
      if (args[0] === "help") {
        return message.channel.send(
          "```" +
            "*bwl channel_id top dd/mm/yyyy" +
            "\n" +
            "channel_id : right click to the channel & copy" +
            "```"
        );
      }

      const channelId = args[0] || message.channel.id;

      const top =
        (!isNaN(parseFloat(args[1])) &&
          !isNaN(args[1] - 0) &&
          parseInt(args[1])) ||
        5;
      const time = args[2];
      if (!channelId || !this.utilsService.getTimeWeek(time)) {
        return message.channel.send("```invalid channel or time```");
      }
       await this.bwlService.findBwlReactData(channelId, this.utilsService.getTimeWeek(time).firstday.timestamp,this.utilsService.getTimeWeek(time).lastday.timestamp, top )
      .then((docs) => {
            let name = [];
            if (docs.length) {
              name = docs.map((doc, index) => {
                return `Top ${index + 1} ${doc.author_username}: ${
                  doc.totalReaction
                } votes`;
              });
            }
            if (Array.isArray(name) && name.length === 0) {
              message.channel.send("```no result```");
            } else {
              message.channel
                .send(
                  "```" +
                    this.utilsService.getTimeWeek(time).firstday.date +
                    " - " +
                    this.utilsService.getTimeWeek(time).lastday.date +
                    "\n" +
                    name.join("\n") +
                    "```"
                )
                .catch(console.error);
            }
          });
    } catch (e) {
      console.log(e);
    }
  }
}
