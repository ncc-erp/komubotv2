import { Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { ClientConfigService } from "src/bot/config/client-config.service";

@CommandLine({
  name: "test",
  description: "test work",
})
export class TestCommand implements CommandLineClass {
  constructor(
    private clientConfigService : ClientConfigService
  ) {}

  async execute(message: Message, args, client) {
    console.log("run");
    console.log('prefix',this.clientConfigService.prefix)
    console.log('api_url_userstatus',this.clientConfigService.user_status.api_url_userstatus)
  }
}
