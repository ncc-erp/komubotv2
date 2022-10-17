import { Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import axios from "axios";
import { UserStatusService } from "./user_status.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ClientConfigService } from "src/bot/config/client-config.service";

@CommandLine({
  name: "userstatus",
  description: "users tatus",
  cat: "komu",
})
export class UserStatusCommand implements CommandLineClass {
  constructor(
    private readonly userStatusService: UserStatusService,
    private readonly http: HttpService,
    private komubotrestService: KomubotrestService,
    private clientConfig: ClientConfigService
  ) {}
  async execute(message: Message, args, client: Client) {
    try {
      let authorId = message.author.id;
      if (args[0] === "help" || !args[0]) {
        return message.channel.send(
          "```" +
            "Command: *userstatus username" +
            "\n" +
            "Example: *userstatus a.nguyenvan" +
            "```"
        );
      }

      let email = args[0];
      // const user = await userData.findOne({
      //   $or: [{ email }, { username: email }],
      // });

      const user = await this.userStatusService.getUserStatus(email);
      if (!user)
        return message.reply(`Wrong Email!`).catch((err) => {
          this.komubotrestService.sendErrorToDevTest(client, authorId, err);
        });
      const getUserStatus = await firstValueFrom(
        this.http
          .get(
            `${this.clientConfig.user_status.api_url_userstatus}?emailAddress=${email}@ncc.asia`
          )
          .pipe((res) => res)
      );
      if (!getUserStatus.data) return;

      let mess;

      if (!getUserStatus.data.result) {
        mess = "Work At Office";
      } else {
        mess = getUserStatus.data.result.message;
      }

      return message.reply(mess).catch((err) => {
        this.komubotrestService.sendErrorToDevTest(client, authorId, err);
      });
    } catch (e) {
      console.log(e);
    }
  }
}
