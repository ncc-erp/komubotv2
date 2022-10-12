import { HttpService } from "@nestjs/axios";
import axios from "axios";
import { Client, Message, TextChannel } from "discord.js";
import { firstValueFrom } from "rxjs";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { NotifiService } from "./noti.service";

@CommandLine({
  name: "thongbao",
  description: "Thong bao",
  cat: "komu",
})
export default class NotificationCommand implements CommandLineClass {
  constructor(
    private notifiService: NotifiService,
    private komubotrestService: KomubotrestService,
    private clientConfigService: ClientConfigService,
    private readonly http: HttpService
  ) {}

  async execute(message: Message, args, client: Client) {
    try {
      const authorId = message.author.id;
      const noti = args.join(" ");
      const checkRole = await this.notifiService.checkrole(authorId);
      if (!noti || noti == undefined) {
        return message
          .reply({
            content: "```please add your text```",
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      }
      if (checkRole.length > 0 || authorId === "871713984670216273") {
        await firstValueFrom(
          this.http
            .post(
              this.clientConfigService.noti.api_url_quickNews,
              {
                content: noti,
              },
              {
                headers: {
                  securityCode: process.env.IMS_KEY_SECRET,
                },
              }
            )
            .pipe((res) => res)
        );
        message.reply({ content: "`✅` Notification saved." }).catch((err) => {
          this.komubotrestService.sendErrorToDevTest(client, authorId, err);
        });
        const fetchChannel = [
          "922135616962068520",
          "922402247260909569",
          "935151571581423626",
          "921686261943635988",
          "921652536933499002",
          "969511102885019688",
          "921239541388554240",
          "990141662665777172",
          "1022323179563270244",
        ];

        fetchChannel.map(async (channel) => {
          const userDiscord = await client.channels.fetch(channel);
          if (message.attachments && message.attachments.first())
            (userDiscord as TextChannel)
              .send({
                content: `${noti}`,
                files: [message.attachments.first().url],
              })
              .catch(console.error);
          else
            (userDiscord as TextChannel).send(`${noti}`).catch(console.error);
        });
      } else {
        return message
          .reply({
            content:
              "```You do not have permission to execute this command!```",
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
