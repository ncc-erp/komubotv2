import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { Client, EmbedBuilder, Message } from "discord.js";
import { ExtendersService } from "src/bot/utils/extenders/extenders.service";
import { ClientConfigService } from "src/bot/config/client-config.service";

@CommandLine({
  name: "botinfo",
  description: "create a poll",
  cat: "utilities",
})
export class BotInfo implements CommandLineClass {
  constructor(
    private extendersService: ExtendersService,
    private readonly clientConfigService: ClientConfigService
  ) {}
  async execute(message: Message, args, client: Client, guildDB) {
    const lang = await this.extendersService.translateMessage(
      "STATS",
      guildDB.lang
    );
    // const guildsCounts = await message.client.shard.fetchClientValues(
    //   "guilds.cache.size"
    // );
    // const guildsCount = guildsCounts.reduce((p, count) => p + count);
    // const a = await message.client.shard.fetchClientValues("users.cache.size");
    // const b = a.reduce((p, count) => p + count);
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
              // .replace("{server}", guildsCount.toLocaleString())
              .replace("{users}", (1 * 29).toLocaleString())}
            `,
        inline: true,
      })
      .setColor(guildDB.color)
      .setThumbnail(
        message.client.user.displayAvatarURL({
          // dynamic: true,
          size: 512,
        })
      )
      .addFields({ name: "Website", value: process.env.LINKS_WEBSITE })
      // .addFields({
      //   name: "Vote",
      //   value: "" + this.clientConfigService.links.topgg + "/vote",
      // })
      .setFooter({
        text: `KOMU`,
        iconURL: message.client.user.displayAvatarURL({
          // dynamic: true,
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
