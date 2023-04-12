import { HttpService } from "@nestjs/axios";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, EmbedBuilder, Message } from "discord.js";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { User } from "src/bot/models/user.entity";
import { ExtendersService } from "src/bot/utils/extenders/extenders.service";
import { Repository } from "typeorm";

@CommandLine({
  name: "userinfo",
  description: "Gives all available informations about a user",
  cat: "utilities",
})
export class UserInfoCommand implements CommandLineClass {
  constructor(
    private readonly http: HttpService,
    private readonly clientConfigService: ClientConfigService,
    private extendersService: ExtendersService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async execute(message: Message, args, client: Client, guildDB) {
    let member;
    if (args.length) {
      member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache
          .filter(
            (m) =>
              m.user.tag.toLowerCase().includes(args[0].toLowerCase()) ||
              m.displayName.toLowerCase().includes(args[0].toLowerCase()) ||
              m.user.username.toLowerCase().includes(args[0].toLowerCase())
          )
          .first();
      if (!member) {
        return this.extendersService.errorMessageMessage(
          this.extendersService.translateMessage("ERROR_USER", guildDB.lang),
          message
        );
      }
    } else {
      member = message.member;
    }

    const findUser = await this.userRepository
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId: member.user.id })
      .andWhere(`"deactive" IS NOT true`)
      .select("*")
      .getRawOne();

    const data = await firstValueFrom(
      this.http
        .get(
          `${
            this.clientConfigService.wiki.api_url
          }${findUser?.email.toLowerCase()}@ncc.asia`,
          {
            headers: {
              "X-Secret-Key": this.clientConfigService.wikiApiKeySecret,
            },
          }
        )
        .pipe((res) => res)
    ).catch((err) => {
      console.log("Error ", err);
    });
    const phoneNumber = (data as any)?.data?.result?.phoneNumber
      ? (data as any).data.result.phoneNumber
      : "";
    const url = `${
      this.clientConfigService.project.getPMOfUser
    }?email=${findUser?.email.toLowerCase()}@ncc.asia`;
    const pmData = await firstValueFrom(
      this.http.get(url).pipe((res) => res)
    ).catch((err) => {
      console.log("Error", err)
    });

    let mess = "";

    if (pmData && pmData.data && pmData.data.result && pmData.data.result.length) {
      mess = `${pmData.data.result[0].projectName} (${pmData.data.result[0].projectCode}) - PM ${pmData.data.result[0].pm.fullName}`
    }
    const lang = this.extendersService.translateMessage(
      "USERINFO",
      guildDB.lang
    );
    const here = this.extendersService.translateMessage("CLIQ", guildDB.lang);
    const roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);
    const embedUser = new EmbedBuilder()
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setColor(
        member.displayHexColor !== "#000000"
          ? member.displayHexColor
          : guildDB.color
      )
      .setAuthor({
        name: `${message.author.username}`,
        url: message.author.displayAvatarURL({
          // dynamic: true,
          size: 512,
        }),
      })
      .addFields({
        name: `__**${lang.title}**__`,
        value: `
                        **${lang.name}** ${member.user.username}
                        **${lang.discrim}**  ${member.user.discriminator}
                        **Id:** ${member.user.id}
                        **Avatar:** [${here}](${member.user.displayAvatarURL({
          dynamic: true,
        })})
                        **${lang.creation}** ${moment(
          member.user.createdTimestamp
        )
          .locale(guildDB.lang)
          .format("LT")} ${moment(member.user.createdTimestamp)
          .locale(guildDB.lang)
          .format("LL")} (\`${moment(member.user.createdTimestamp)
          .locale(guildDB.lang)
          .fromNow()}\`)
                        **Phone**: ${phoneNumber}
                        **Project:** ${mess}
              \n\n`,
      })
      .addFields({
        name: `__**${lang.second}**__`,
        value: `**${lang.higest}** ${
          member.roles.highest.id === message.guild.id
            ? lang.none
            : member.roles.highest.name
        }
                         **${lang.join}** ${moment(member.joinedAt).format(
          "LL LTS"
        )}(\`${moment(member.joinedAt).locale(guildDB.lang).fromNow()}\`)
                         **${lang.hoist}** ${
          member.roles.hoist ? member.roles.hoist.name : lang.none
        }
                         **Roles [${roles.length}]:**\n${
          roles.length < 10
            ? roles.join(", ")
            : roles.length > 10
            ? `${member.roles.cache
                .map((r) => r)
                .slice(0, 10)} ${lang.rest.replace(
                "{rest}",
                member.roles.cache.size - 10
              )}`
            : lang.none
        }
            \n\n`,
      })
      .setFooter({
        text: "KOMU",
        iconURL: message.client.user.displayAvatarURL({
          // dynamic: true,
          size: 512,
        }),
      });
    message.channel
      .send({
        embeds: [embedUser],
        allowedMentions: { repliedUser: false },
      })
      .catch(console.error);
  }
}
