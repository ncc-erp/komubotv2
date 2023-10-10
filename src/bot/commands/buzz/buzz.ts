import { Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { CallUserService } from "src/bot/utils/callUser/callUser.service";
import { UtilsService } from "src/bot/utils/utils.service";

@CommandLine({
  name: "buzz",
  description: "send message",
  cat: "komu",
})
export class BuzzCommand implements CommandLineClass {
  constructor(
    private callUserService: CallUserService,
    private utilsService: UtilsService
  ) {}

  async execute(message: Message, args, client: Client) {
    try {
      // await this.callUserService.callUser(message, args, client);
      await this.utilsService.checkHoliday();
    } catch (error) {}
  }
}
