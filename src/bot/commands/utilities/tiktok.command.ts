import { EmbedBuilder } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { ExtendersService } from "src/bot/utils/extenders/extenders.service";
import * as TikTokScraper from "tiktok-scraper";

@CommandLine({
  name: "tiktok",
  description: "Gives information on a tiktok profile",
  cat: "utilities",
})
export class TiktokCommand implements CommandLineClass {
  constructor(private extendersService: ExtendersService) {}

  async execute(message, args, client, guildDB) {
    const lang = this.extendersService.translateMessage("TIKTOK", guildDB.lang);
    try {
      const user = await TikTokScraper.getUserProfileInfo(args[0]);
      console.log(user);
      if (!user) {
        return this.extendersService.errorMessageMessage(
          lang.error.replace("{text}", args[0]),
          message
        );
      }
      const userbe = new EmbedBuilder().setColor("#b434eb");
      if (user.user.verified == true) {
        userbe.setTitle(
          `@${user.user.uniqueId} <:checkbleu:834014123791482910>`
        );
      } else {
        userbe.setTitle(`@${user.user.uniqueId}`);
      }
      userbe
        .setURL(`https://www.tiktok.com/@${user.user.uniqueId}`)
        .setThumbnail(user.user.avatarThumb)
        .addFields(lang.a, `${user.user.uniqueId}`, true)
        .addFields(lang.b, `${user.user.nickname}`, true);
      if (user.user.signature == "") {
        userbe.addFields("`📜` Bio", lang.c);
      } else {
        userbe.addFields("`📜` Bio" as any, `${user.user.signature}`);
      }
      userbe
        .addFields(
          lang.d,
          new Intl.NumberFormat().format(
            parseFloat(user.stats.followerCount as any)
          ),
          true
        )
        .addFields(
          lang.e,
          new Intl.NumberFormat().format(
            parseInt(user.stats.followingCount as any)
          ),
          true
        )
        .addFields(
          lang.f,
          new Intl.NumberFormat().format(parseInt(user.stats.heartCount as any))
        )
        .setFooter(
          //   message.client.footer,
          message.client.user.displayAvatarURL({ dynamic: true, size: 512 })
        );

      message.channel
        .send({
          embeds: [userbe],
          allowedMentions: { repliedUser: false },
        })
        .catch(console.error);
    } catch (error) {
      console.log(error);
      return this.extendersService.errorMessageMessage(
        lang.error.replace("{text}", args[0]),
        message
      );
    }
  }
}
