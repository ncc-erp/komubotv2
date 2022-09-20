import { Message } from "discord.js";
import { sendErrorToDevTest } from "src/bot/utils/komu.util";
import { CommandLine, CommandLineClass } from "../../base/command.base";


import { LeaveService } from "./leave.service";

@CommandLine({
  name: "leave",
  description: "leave",
})
export default class LeaveCommand implements CommandLineClass {
  constructor(
    private readonly leaveService: LeaveService
  ) {}

  async execute(message: Message, args, Client) {
    try {
      let authorId = message.author.id;
      if (!args[0] || !args[1]) {
        return message
          .reply("```" + "*leave minute reason  " + "```")
          .catch((err) => {
            sendErrorToDevTest(Client, authorId, err);
          });
      }
      const minute =
        !isNaN(parseFloat(args[0])) && !isNaN(args[0] - 0) && parseInt(args[0]);

      if (!minute) {
        return message.reply("Minute must be a number").catch((err) => {
          sendErrorToDevTest(Client, authorId, err);
        });
      }
      const reason = args.slice(1, args.length).join(" ");
      await this.leaveService.saveLeave(message, {minute: minute, reason: reason})

      return message.reply("`✅` Leave saved").catch((err) => {
        sendErrorToDevTest(Client, authorId, err);
      });
    } catch (err) {
      console.log(err);
    }
  }
}
