import { Client, Message } from "discord.js";
import { ExtendersService } from "src/bot/utils/extenders/extenders.service";
import { CommandLine, CommandLineClass } from "../../base/command.base";

@CommandLine({
  name: "avatar",
  description:
    "Affiche l'avatar d'un utilisateur (ou le vôtre, si aucun utilisateur n'est mentionné).",
  cat: "utilities",
})
export class AvatarCommand implements CommandLineClass {
  constructor(private extendersService: ExtendersService) {}

  async execute(message: Message, args, client: Client, guildDB) {
    let member;
    if (args.length) {
      member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache
          .filter(
            (m) =>
              m.user.tag.toLowerCase() === args[0].toLowerCase() ||
              m.displayName.toLowerCase() === args[0].toLowerCase() ||
              m.user.username.toLowerCase() === args[0].toLowerCase()
          )
          .first();
      if (!member) {
        const err = await this.extendersService.translateMessage(
          "ERROR_USER",
          guildDB.lang
        );
        return this.extendersService.errorMessageMessage(err, message);
      }
    } else {
      member = message.member;
    }
    const a = await this.extendersService.translateMessage(
      "AVATAR",
      guildDB.lang
    );
    const b = await this.extendersService.translateMessage(
      "AVATAR_DESC",
      guildDB.lang
    );
    message.channel.send({
      embeds: [
        {
          author: {
            name: `${a}${member.user.tag}`,
            icon_url: member.user.displayAvatarURL({
              dynamic: true,
              size: 512,
            }),
            url: process.env.LINKS_INVITE,
          },
          // color: guildDB.color,
          image: {
            url: member.user.displayAvatarURL({ dynamic: true, size: 512 }),
          },
          footer: {
            text: message.client.footer,
            icon_url: message.client.user.displayAvatarURL({
              // dynamic: true,
              size: 512,
            }),
          },
          description: b.replace(
            "{url}",
            member.user.displayAvatarURL({ dynamic: true, size: 512 })
          ),
        },
      ],
      allowedMentions: { repliedUser: false },
    });
  }
}
