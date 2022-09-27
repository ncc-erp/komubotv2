import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { EmbedBuilder } from "discord.js";
import { ExtendersService } from "src/bot/utils/extenders/extenders.service";

@CommandLine({
  name: "botinfo",
  description: "create a poll",
})
export class BotInfo implements CommandLineClass {
  constructor(
    private extendersService: ExtendersService,
    ) {}
  async execute(message, args, client, guildDB) {
    const lang = await this.extendersService.translateMessage("STATS", guildDB.lang);
    const guildsCounts = await message.client.shard.fetchClientValues(
      "guilds.cache.size"
    );
    const guildsCount = guildsCounts.reduce((p, count) => p + count);
    const a = await message.client.shard.fetchClientValues("users.cache.size");
    const b = a.reduce((p, count) => p + count);
    console.log(client.users.cache.size * 4);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${message.client.user.tag}`,
        iconURL: message.client.user.displayAvatarURL(),
        url: process.env.LINKS_INVITE,
      })
      .addFields({
        name: "__Informations__",
        value: `
            \n\n
            ${lang.field
              .replace("{server}", guildsCount.toLocaleString())
              .replace("{users}", (b * 29).toLocaleString())}
            `,
        inline: true,
      })
      .setColor(guildDB.color)
      .setThumbnail(
        message.client.user.displayAvatarURL({
          dynamic: true,
          size: 512,
        })
      )
      .addFields({ name: "Website", value: process.env.LINKS_WEBSITE })
      .addFields({
        name: "Vote",
        value: "" + client.config.links.topgg + "/vote",
      })
      .setFooter({
        text: `${message.client.footer}`,
        iconURL: message.client.user.displayAvatarURL({
          dynamic: true,
          size: 512,
        }),
      });

    message.channel
      .send({ embeds: [embed], allowedMentions: { repliedUser: false } })
      .catch(() => {
        message.channel.send({
          embeds: [embed],
          allowedMentions: { repliedUser: false },
        });
      });
  }
}
