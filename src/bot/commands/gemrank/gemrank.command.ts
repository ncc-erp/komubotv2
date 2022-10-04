import { Client, EmbedBuilder, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";

import axios from "axios";
import { ClientConfigService } from "../../config/client-config.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@CommandLine({
  name: "gem",
  description: "Gem rank",
  cat: "komu",
})
export class GemrankCommand implements CommandLineClass {
  constructor(
    private komuborestController: KomubotrestService,
    private readonly http: HttpService,
    private clienConfigService: ClientConfigService
  ) {}
  private messHelp: string =
    "```" + "*gem rank" + "\n" + "*gem rank username" + "```";
  async execute(message: Message, args, client: Client) {
    try {
      let authorId = message.author.id;
      if (args[0] === "rank") {
        if (args[1]) {
          let rankUsername;
          const usernameGem = args.slice(1, args.length).join(" ");
          try {
            rankUsername = await firstValueFrom(
              this.http
                .get(
                  `${this.clienConfigService.gem.api_url_getMyRank}${usernameGem}`
                )
                .pipe((res) => res)
            );
          } catch (error) {
            return message.reply({
              content: `${this.messHelp}`,
              // ephemeral: true,
            });
          }

          const rank = rankUsername.data.outputRankingDTO;
          let mess = `elo: ${rank.elo}, ranking: ${rank.ranking}`;
          const Embed = new EmbedBuilder()
            .setTitle(`${rank.username} ranking`)
            .setColor(0xed4245)
            .setDescription(`${mess}`);
          await message.reply({ embeds: [Embed] }).catch((err) => {
            this.komuborestController.sendErrorToDevTest(client, authorId, err);
          });
        } else {
          const postGemRank = await firstValueFrom(
            this.http
              .post(this.clienConfigService.gem.api_url_getTopRank, {
                page: 0,
                size: 15,
              })
              .pipe((res) => res)
          );
          const rankTop = postGemRank.data.content;

          for (let i = 0; i <= Math.ceil(rankTop.length / 50); i += 1) {
            if (rankTop.slice(i * 50, (i + 1) * 50).length === 0) break;
            const mess = rankTop
              .slice(i * 50, (i + 1) * 50)
              .map(
                (list) =>
                  `${list.ranking}: ${list.displayName}, elo: ${list.elo}`
              )
              .join("\n");
            const Embed = new EmbedBuilder()
              .setTitle(`Top ranking`)
              .setColor(0xed4245)
              .setDescription(`${mess}`);
            await message.reply({ embeds: [Embed] }).catch(console.error);
          }
        }
      } else {
        return message
          .reply({
            content: `${this.messHelp}`,
            // ephemeral: true,
          })
          .catch((err) => {
            this.komuborestController.sendErrorToDevTest(client, authorId, err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
