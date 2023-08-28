import { Client, EmbedBuilder, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { ExtendersService } from "src/bot/utils/extenders/extenders.service";

@CommandLine({
  name: "links",
  description: "Envoye un lien pour inviter le bot :)",
  cat: "utilities",
})
export class LinksCommand implements CommandLineClass {
  constructor(
    private extendersService: ExtendersService,
    private readonly clientConfigService: ClientConfigService
  ) {}

  async execute(message, args, client, guildDB) {
    const here = await this.extendersService.translateMessage(
      "CLIQ",
      guildDB.lang
    );
    const lang = await this.extendersService.translateMessage(
      "LINKS",
      guildDB.lang
    );
    if (message.content.includes("invite") || message.content.includes("add")) {
      message.channel.send({
        embeds: [
          {
            author: {
              name: message.author.username,
              icon_url: message.author.displayAvatarURL({
                // dynamic: true,
                size: 512,
              }),
            },
            // color: guildDB.color,
            description: `Want to invite KOMU on your server? [Click here](${this.clientConfigService.linksupport})`,
            footer: {
              text: message.client.footer,
              icon_url: message.client.user.displayAvatarURL({
                // dynamic: true,
                size: 512,
              }),
            },
          },
        ],
        allowedMentions: { repliedUser: false },
      });
    } else if (
      message.content.includes("support") ||
      message.content.includes("discord")
    ) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${message.author.username}`,
          url: message.author.displayAvatarURL({
            // dynamic: true,
            size: 512,
          }),
        })
        .setColor(guildDB.color)
        .setDescription(
          `${
            guildDB.lang === "fr"
              ? " Vous pouvez rejoindre le discord de support en cliquant [ici](" +
                this.clientConfigService.linksupport +
                ")"
              : " You can join our support discord by clicking [`here`](" +
                this.clientConfigService.linksupport +
                ")"
          }`
        )
        .setFooter({
          text: message.client.footer,
          iconURL: message.client.user.displayAvatarURL({
            // dynamic: true,
            size: 512,
          }),
        });
      message.channel.send({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
    } else if (message.content.includes("vote")) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${message.author.username}`,
          url: message.author.displayAvatarURL({
            //  dynamic: true,
            size: 512,
          }),
        })
        .setColor(guildDB.color)
        .setDescription(
          `${
            guildDB.lang === "fr"
              ? "Vous pouvez voter pour KOMU [ici](" +
                this.clientConfigService.topgg_url +
                "/vote)"
              : " You can upvote me by clicking [here](" +
                this.clientConfigService.topgg_url +
                "/vote)"
          }`
        )
        .setFooter({
          text: "KOMU",
          iconURL: message.client.user.displayAvatarURL({
            // dynamic: true,
            size: 512,
          }),
        });
      message.channel.send({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
    } else {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${message.author.username}`,
          url: message.author.displayAvatarURL({
            //  dynamic: true,
            size: 512,
          }),
        })
        .setColor(guildDB.color)
        .addFields({
          name: " Support:",
          value: "[" + here + "](" + this.clientConfigService.linksupport + ")",
          inline: true,
        })
        .addFields({
          name: "Invite:",
          value: "[" + here + "](" + this.clientConfigService.linkinvite + ")",
          inline: true,
        })
        .addFields({
          name: "Dashboard:",
          value: "[" + here + "](" + this.clientConfigService.linkwebsite + ")",
          inline: true,
        })
        .addFields({
          name: "Vote:",
          value:
            "[" + here + "](" + this.clientConfigService.topgg_url + "/vote)",
          inline: true,
        })
        .setDescription(lang)
        .setThumbnail(
          message.client.user.displayAvatarURL({
            // dynamic: true,
            size: 512,
          })
        )
        .setFooter({
          text: "KOMU",
          iconURL: message.client.user.displayAvatarURL({
            // dynamic: true,
            size: 512,
          }),
        });

      message.channel.send({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
    }
  }
}
