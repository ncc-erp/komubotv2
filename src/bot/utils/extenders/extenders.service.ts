import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmbedBuilder, Message } from "discord.js";
import { Msg } from "src/bot/models/msg.entity";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import translate from "@vitalets/google-translate-api";
import lang from "../../languages/lang.json";
import { GuildData } from "src/bot/models/guildData.entity";
import { Channel } from "src/bot/models/channel.entity";

@Injectable()
export class ExtendersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Msg)
    private msgRepository: Repository<Msg>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(GuildData)
    private guildDataRepository: Repository<GuildData>
  ) {}

  async addDBUser(displayname, message: Message) {
    let data = await this.userRepository
      .createQueryBuilder()
      .where(`"username" = :username`, {
        username: message.author.username,
      })
      .andWhere(`"isCancel" IS NOT TRUE`)
      .select("*")
      .execute();

    if (!data)
      await this.userRepository
        .insert({
          userId: message.id,
          username: message.author.username,
          discriminator: message.author.discriminator,
          avatar: message.author.avatar,
          bot: message.author.bot,
          system: message.system,
          banner: message.author.banner,
          email: displayname,
          flags: message.flags as any,
          // premium_type: message.premium_type,
          // public_flags: message.public_flags,
        })
        .catch((err) => console.log(err));

    data = await this.userRepository
      .createQueryBuilder()
      .where(`"username" = :username`, {
        email: displayname,
      })
      .andWhere(`"isCancel" IS NOT TRUE`)
      .select("*")
      .execute();

    if (!data)
      await this.userRepository
        .insert({
          userId: message.id,
          username: message.author.username,
          discriminator: message.author.discriminator,
          avatar: message.author.avatar,
          bot: message.author.bot,
          system: message.system,
          banner: message.author.banner,
          email: displayname,
          flags: message.flags as any,
          // premium_type: message.premium_type,
          // public_flags: message.public_flags,
        })
        .catch((err) => console.log(err));
  }

  async addDBMessage(message) {
    const user = await this.userRepository.findOne({
      where: {
        userId: message.author.id,
      },
    });
    const channelInsert = await this.channelRepository.findOne({
      where: {
        id: message.channelId,
      },
    });
    return await this.msgRepository
      .insert({
        channel: channelInsert,
        guildId: message.guildId,
        deleted: message.deleted,
        id: message.id,
        createdTimestamp: message.createdTimestamp,
        type: message.type,
        system: message.system,
        content: message.content,
        author: user,
        pinned: message.pinned,
        tts: message.tts,
        nonce: message.nonce,
        editedTimestamp: message.editedTimestamp,
        webhookId: message.webhookId,
        applicationId: message.applicationId,
        flags: message.flags,
      })
      .catch((err) => console.log(err));
  }

  async addDBGuild(guildID, Guild) {
    if (!guildID || isNaN(guildID)) {
      guildID = Guild.id;
    }
    return await this.guildDataRepository
      .insert({
        serverID: guildID,
        prefix: "*",
        lang: "en",
        premium: null,
        premiumUserID: null,
        color: "#3A871F",
        backlist: null,
      })
      .catch((err) => console.log(err));
  }

  async fetchDBGuild(guildID, Guild) {
    if (!guildID || isNaN(guildID)) {
      guildID = Guild.id;
    }
    let data = await this.guildDataRepository.findOne({
      where: { serverID: guildID },
    });
    if (!data) data = (await this.addDBGuild(guildID, Guild)) as any;
    return data;
  }

  translateMessage = function (text, guildDB = {}) {
    if (!text || !lang.translations[text]) {
      throw new Error(
        `Translate: Params error: Unknow text ID or missing text ${text}`
      );
    }
    if (!guildDB) return console.log("Missing guildDB");
    return lang.translations[text][guildDB];
  };

  async translateGuild(text, Guild) {
    if (text) {
      if (!lang.translations[text]) {
        throw new Error(`Unknown text ID "${text}"`);
      }
    } else {
      throw new Error("Not text Provided");
    }
    const langbd = await this.guildDataRepository.findOne({
      where: { serverID: Guild.id },
    });
    let target;
    if (langbd) {
      target = langbd.lang;
    } else {
      target = "en";
    }
    return lang.translations[text][target];
  }

  async translateeGuild(text, target) {
    if (text) {
      if (!lang.translations[text]) {
        throw new Error(`Unknown text ID "${text}"`);
      }
    } else {
      throw new Error("Aucun texte indiqué ");
    }
    return lang.translations[text][target];
  }

  async ggMessage(text, Message) {
    if (!text) {
      this.errorOccurredMessage("No text provided", "en", Message);
      throw new Error("Aucun texte indiqué ");
    }
    const target = Message.guild.lang;
    const texttoreturn = await translate(text, { to: target })
      .then((res) => res.text)
      .catch((error) => console.log(error));
    return (texttoreturn as any)
      .replace("show", "channel")
      .replace("living room", "channel")
      .replace("room", "channel");
  }

  errorMessageMessage(text, Message) {
    if (text) {
      return Message.channel.send({
        embeds: [
          {
            description: text,
            // color: "#C73829",
            author: {
              name: Message.guild.name,
              icon_url: Message.guild.icon
                ? Message.guild.iconURL({ dynamic: true })
                : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
            },
          },
        ],
      });
    } else {
      this.errorOccurredMessage("No text provided", "en", Message);
      throw new Error("Error: No text provided");
    }
  }

  succesMessageMessage(text, Message) {
    if (text) {
      Message.channel.send({
        embeds: [
          {
            description: text,
            color: "#2ED457",
          },
        ],
      });
    } else {
      this.errorOccurredMessage("No text provided", "en", Message);
      throw new Error("Error: No text provided");
    }
  }

  async usageMessage(guildDB, cmd, Message) {
    let langUsage;
    if (cmd.usages) {
      langUsage = await this.translateMessage("USES", guildDB.lang);
    } else {
      langUsage = await this.translateMessage("USES_SING", guildDB.lang);
    }
    const read = await this.translateMessage("READ", guildDB.lang);
    const u = await this.translateMessage("ARGS_REQUIRED", guildDB.lang);
    Message.channel.send({
      embeds: [
        {
          description: `${u.replace(
            "{command}",
            cmd.name
          )}\n${read}\n\n**${langUsage}**\n${
            cmd.usages
              ? cmd.usages.map((x) => guildDB.prefix + x).join("\n")
              : guildDB.prefix + cmd.name + " " + cmd.usage
          }`,
          // color: "#C73829",
          author: {
            name: Message.author.username,
            icon_url: Message.author.displayAvatarURL({
              dynamic: !0,
              size: 512,
            }),
          },
        },
      ],
    });
  }

  mainMessageMessage(text, Message) {
    if (text) {
      const embed1 = new EmbedBuilder()
        .setAuthor(Message.author.tag)
        .setDescription(`${text}`)
        // .setColor("#3A871F")
        .setFooter(
          Message.client.footer
          // Message.client.user.displayAvatarURL({ dynamic: true, size: 512 })
        );
      Message.channel
        .send({ embeds: [embed1], allowedMentions: { repliedUser: false } })
        .then((m) => {
          m.react("<:delete:830790543659368448>");
          const filter = (reaction, user) =>
            reaction.emoji.id === "830790543659368448" &&
            user.id === Message.member.id;
          const collector = m.createReactionCollector({
            filter,
            time: 11000,
            max: 1,
          });
          collector.on("collect", async () => {
            m.delete();
          });
          collector.on("end", () => m.reactions.removeAll());
        });
    } else {
      throw new Error("Error: No text provided");
    }
  }

  async errorOccurredMessage(err, guildDB, Message) {
    const content = await this.translateMessage("ERROR", guildDB.lang);
    const r = new EmbedBuilder()
      // .setColor("#F0B02F")
      .setTitle(content.title)
      .setDescription(content.desc)
      .setFooter(("Error code: " + err) as any);
    return Message.channel.send({ embeds: [r] });
  }
}
