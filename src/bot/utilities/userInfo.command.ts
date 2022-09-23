import { EmbedBuilder } from "discord.js";
import moment from "moment";
import { CommandLine, CommandLineClass } from "../base/command.base";

@CommandLine({
  name: "userinfo",
  description: "Gives all available informations about a user",
})
export class UserInfoCommand implements CommandLineClass {
  async execute(message, args, client, guildDB) {
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
        return message.errorMessage(
          message.translate("ERROR_USER", guildDB.lang)
        );
      }
    } else {
      member = message.member;
    }

    const data = await axios
      .get(`${client.config.wiki.api_url}${member.user.username}@ncc.asia`, {
        headers: { "X-Secret-Key": process.env.WIKI_API_KEY_SECRET },
      })
      .catch((err) => {
        console.log("Error ", err);
      });
    const phoneNumber = data.data.result.phoneNumber;
    let api_url_getListProjectOfUserApi;
    try {
      const url = `${client.config.project.api_url_getListProjectOfUser}?email=${member.user.username}@ncc.asia`;
      api_url_getListProjectOfUserApi = await axios.get(url);
    } catch (error) {
      console.log(error);
    }

    const api_url_getListProject = [];
    api_url_getListProjectOfUserApi
      ? api_url_getListProjectOfUserApi.data.result.map((item) => {
          api_url_getListProject.push({
            projectName: item.projectName,
            projectCode: item.projectCode,
          });
        })
      : [];

    const mess = api_url_getListProject
      .map((item) => `- ${item.projectName} (${item.projectCode})`)
      .join("\n");
    const lang = message.translate("USERINFO", guildDB.lang);
    const here = message.translate("CLIQ", guildDB.lang);
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
        url: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
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
                        **Project[${
                          api_url_getListProject.length
                        }]: \n **${mess}
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
        text: message.client.footer,
        iconURL: message.client.user.displayAvatarURL({
          dynamic: true,
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
