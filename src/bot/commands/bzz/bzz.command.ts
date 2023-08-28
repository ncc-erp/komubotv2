import { Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { CallUserService } from "src/bot/utils/callUser/callUser.service";

@CommandLine({
  name: "bzz",
  description: "send message",
  cat: "komu",
})
export class BzzCommand implements CommandLineClass {
  constructor(private callUserService: CallUserService) {}

  async execute(message: Message, args, client: Client) {
    try {
      await this.callUserService.callUser(message, args, client);
    } catch (error) {}
  }
}
