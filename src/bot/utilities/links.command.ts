import { EmbedBuilder } from "discord.js";
import { CommandLine, CommandLineClass } from "../base/command.base";

@CommandLine({
  name: "links",
  description: "Envoye un lien pour inviter le bot :)",
})
export class LinksCommand implements CommandLineClass {
  async execute(message, args, client, guildDB) {
    const here = await message.translate("CLIQ", guildDB.lang);
    const lang = await message.translate("LINKS", guildDB.lang);
    if (message.content.includes("invite") || message.content.includes("add")) {
      message.channel.send({
        embeds: [
          {
            author: {
              name: message.author.username,
              icon_url: message.author.displayAvatarURL({
                dynamic: true,
                size: 512,
              }),
            },
            color: guildDB.color,
            description: `Want to invite KOMU on your server? [Click here](${process.env.LINKS_INVITE})`,
            footer: {
              text: message.client.footer,
              icon_url: message.client.user.displayAvatarURL({
                dynamic: true,
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
          url: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
        })
        .setColor(guildDB.color)
        .setDescription(
          `${
            guildDB.lang === "fr"
              ? " Vous pouvez rejoindre le discord de support en cliquant [ici](" +
                process.env.LINKS_SUPPORT +
                ")"
              : " You can join our support discord by clicking [`here`](" +
                process.env.LINKS_SUPPORT +
                ")"
          }`
        )
        .setFooter({
          text: message.client.footer,
          iconURL: message.client.user.displayAvatarURL({
            dynamic: true,
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
          url: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
        })
        .setColor(guildDB.color)
        .setDescription(
          `${
            guildDB.lang === "fr"
              ? "Vous pouvez voter pour KOMU [ici](" +
                client.config.topgg_url +
                "/vote)"
              : " You can upvote me by clicking [here](" +
                client.config.topgg_url +
                "/vote)"
          }`
        )
        .setFooter({
          text: message.client.footer,
          iconURL: message.client.user.displayAvatarURL({
            dynamic: true,
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
          url: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
        })
        .setColor(guildDB.color)
        .addFields({
          name: " Support:",
          value: "[" + here + "](" + process.env.LINKS_SUPPORT + ")",
          inline: true,
        })
        .addFields({
          name: "Invite:",
          value: "[" + here + "](" + process.env.LINKS_INVITE + ")",
          inline: true,
        })
        .addFields({
          name: "Dashboard:",
          value: "[" + here + "](" + process.env.LINKS_WEBSITE + ")",
          inline: true,
        })
        .addFields({
          name: "Vote:",
          value: "[" + here + "](" + client.config.topgg_url + "/vote)",
          inline: true,
        })
        .setDescription(lang)
        .setThumbnail(
          message.client.user.displayAvatarURL({
            dynamic: true,
            size: 512,
          })
        )
        .setFooter({
          text: message.client.footer,
          iconURL: message.client.user.displayAvatarURL({
            dynamic: true,
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
