import {
  InjectDiscordClient,
  On,
  Once,
} from "@discord-nestjs/core";
import { Injectable, Logger, UseGuards, UsePipes } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ChannelType,
  Client,
  Message,
  MessageType,
  Interaction,
  Guild,
  PartialDMChannel,
  NewsChannel,
  TextChannel,
  PublicThreadChannel,
  PrivateThreadChannel,
  VoiceChannel,
  EmbedBuilder,
  ButtonInteraction,
} from "discord.js";
import { DataSource, Repository } from "typeorm";
import { DiscoveryService } from "@nestjs/core";
import { MessageFromUserGuard } from "../message-from-user.guard";
import { MessageToUpperPipe } from "../../pipes/message-to-upper.pipe";
import { DECORATOR_COMMAND_LINE } from "../../base/command.constans";
import { ClientConfigService } from "../../config/client-config.service";
import DBL from "dblapi.js";
import { ExtendersService } from "../../utils/extenders/extenders.service";
import permes from "../../constants/permes.json";
import * as queryString from "query-string";
import { User } from "../../models/user.entity";
import { QuizService } from "../../utils/quiz/quiz.service";
import { KomubotrestService } from "../../utils/komubotrest/komubotrest.service";
import { WfhService } from "src/bot/utils/wfh/wfh.service";
import { DmmessageService } from "src/bot/utils/dmmessage/dmmessage.service";
import { WorkoutService } from "src/bot/utils/workout/workout.service";
export type ChanneNotDM =
  | NewsChannel
  | TextChannel
  | PublicThreadChannel
  | PrivateThreadChannel
  | VoiceChannel;
@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient() private client: Client,
    private dataSource: DataSource,
    private discoveryService: DiscoveryService,
    private clientConfigService: ClientConfigService,
    private extendersService: ExtendersService,
    private dmmessageService: DmmessageService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private quizService: QuizService,
    private komubotrestService: KomubotrestService,
    private wfhService: WfhService,
    private workoutService: WorkoutService
  ) { }
  ID_KOMU = "922003239887581205";

  @Once("ready")
  onReady(client: Client) {
    console.log("[KOMU] Ready");
    (async () => {
      try {
        console.log("Successfully registered application commands globally");
      } catch (error) {
        if (error) console.error(error);
      }
    })();

    (client as any).dbl = new DBL(this.clientConfigService.topgg, client);
    const activities = [
      { name: "KOMU • *help", type: "WATCHING" },
      { name: "KOMU • *help", type: "WATCHING" },
    ];
    client.user.setActivity(activities[0].name, { type: "WATCHING" as any });
    let activity = 1;
    setInterval(async () => {
      activities[2] = { name: "KOMU", type: "WATCHING" };
      activities[3] = { name: "KOMU", type: "WATCHING" };
      if (activity > 3) activity = 0;
      client.user.setActivity(activities[activity].name, {
        type: "WATCHING" as any,
      });
      activity++;
    }, 30000);
  }

  @On("messageCreate")
  @UseGuards(MessageFromUserGuard)
  @UsePipes(MessageToUpperPipe)
  async onMessage(message: Message) {
    const { client } = message;
    if (
      message.channel.type === ChannelType.DM &&
      message.author.id != client.user.id
    ) {
      this.dmmessageService.dmmessage(message, client);
      return;
    }
    if (message.author.bot || !message.guild) return;

    const user_mention = message.author.id;
    const user_mentioned = message.mentions.users.map((user) => user.id);
    if (
      Array.isArray(user_mentioned) &&
      user_mentioned.length >= 1 &&
      user_mentioned.includes(this.ID_KOMU)
    ) {
      const content = message.content;
      let message_include_content;
      if (content.trim().startsWith("<@!")) {
        message_include_content = content.slice(22, content.length).trim();
        const res = await this.dmmessageService.getMessageAI(
          this.dmmessageService.API_URL,
          user_mention,
          message_include_content,
          this.dmmessageService.API_TOKEN
        );
        if (res && res.data && res.data.length) {
          res.data.map((item) => {
            return message.reply(item.text).catch(console.log);
          });
        } else {
          message.reply("Very busy, too much work today. I'm so tired. (Gateway).");
          return;
        }
      }
    }

    let guildDB = await this.extendersService.fetchDBGuild(null, message.guild);
    let i;
    let argument;
    let r;
    if (message.content.startsWith("*")) {
      if (message.content.endsWith("*") && !message.content.includes("prefix"))
        return;
      if (message.content.startsWith("*")) {
        const messageContent = message.content;
        argument = messageContent
          .replace("\n", " ")
          .slice("*".length)
          .trim()
          .split(/ +/);
      }
      r = argument.shift().toLowerCase();
      // check command and excute
      this.discoveryService.getProviders().forEach((provider) => {
        if (typeof provider !== "string") {
          const instance = provider.instance;
          if (!instance || typeof instance === "string") return;
          if (!Reflect.getMetadata(DECORATOR_COMMAND_LINE, instance)) return;
          if (
            !Reflect.getMetadata(DECORATOR_COMMAND_LINE, instance)?.name ||
            !Reflect.getMetadata(DECORATOR_COMMAND_LINE, instance)?.description
          ) {
            this.logger.error(
              "please make property name and description in decorator @CommandLine"
            );
          }
          if (
            r === Reflect.getMetadata(DECORATOR_COMMAND_LINE, instance)?.name
          ) {
            i = instance;
          }
        }
      });
    }
    if (!i) return;

    const me = message.guild.members.cache.get(message.client.user.id);
    const channelBotPerms = (message.channel as ChanneNotDM).permissionsFor(me);

    if (!channelBotPerms.has("SendMessages")) {
      return message.member.send(
        "❌ I don't have permission to send messages in this channel."
      );
    }
    if (!channelBotPerms.has("EmbedLinks")) {
      return message.channel.send(
        "❌ The bot must have the `Embed links` permissions to work properly !"
      );
    }
    if (i.permissions) {
      typeof i.permissions == "string" && (i.permissions = [i.permissions]);
      for (const permission of i.permissions) {
        if (
          !(message.channel as ChanneNotDM)
            .permissionsFor(message.member)
            .has(permission)
        ) {
          const d = await this.extendersService.translateMessage(
            "MISSING_PERMISSIONS",
            guildDB.lang
          );
          if (permission !== "MANAGE_GUILD") {
            return this.extendersService.errorMessageMessage(
              d.replace(
                "{perm}",
                permes[permission]
                  ? permes[permission][guildDB.lang]
                  : permission
              ),
              message
            );
          }
          {
            const missingRole = await this.extendersService.translateMessage(
              "MISSING_ROLE",
              guildDB
            );
            if (!guildDB.admin_role) {
              return this.extendersService.errorMessageMessage(
                d.replace(
                  "{perm}",
                  permes[permission]
                    ? permes[permission][guildDB.lang]
                    : permission
                ),
                message
              );
            }
            const AdminRole = message.guild.roles.cache.get(guildDB.admin_role);
            if (!AdminRole) {
              return this.extendersService.errorMessageMessage(
                d.replace(
                  "{perm}",
                  permes[permission]
                    ? permes[permission][guildDB.lang]
                    : permission
                ),
                message
              );
            }
            if (!message.member.roles.cache) {
              return this.extendersService.errorMessageMessage(
                missingRole
                  .replace(
                    "{perm}",
                    permes[permission]
                      ? permes[permission][guildDB.lang]
                      : permission
                  )
                  .replace("{role}", AdminRole),
                message
              );
            }
            if (!message.member.roles.cache.has(AdminRole.id)) {
              return this.extendersService.errorMessageMessage(
                missingRole
                  .replace(
                    "{perm}",
                    permes[permission]
                      ? permes[permission][guildDB.lang]
                      : permission
                  )
                  .replace("{role}", AdminRole),
                message
              );
            }
          }
        }
      }
    }
    if (i.args && !argument.length) {
      const u = await this.extendersService.translateMessage(
        "ARGS_REQUIRED",
        guildDB.lang
      );
      const read = await this.extendersService.translateMessage(
        "READ",
        guildDB.lang
      );
      let langUsage;
      if (i.usages) {
        langUsage = await this.extendersService.translateMessage(
          "USES",
          guildDB.lang
        );
      } else {
        langUsage = await this.extendersService.translateMessage(
          "USES_SING",
          guildDB.lang
        );
      }
      message.channel.send({
        embeds: [
          {
            color: 0x0099ff,
            description: `${u.replace(
              "{command}",
              r
            )}\n${read}\n\n**${langUsage}**\n${i.usages
                ? i.usages.map((x) => guildDB.prefix + x).join("\n")
                : guildDB.prefix + r + " " + i.usage
              }`,
            footer: {
              text: this.clientConfigService.footer,
              icon_url: message.client.user.displayAvatarURL(),
            },
            author: {
              name: message.author.username,
              icon_url: message.author.displayAvatarURL({ size: 512 }),
              url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456",
            },
          },
        ],
      });
      return;
    }

    try {
      i.execute(message, argument, client, guildDB, module, this.dataSource);
      return;
    } catch (error) { }
  }

  @On("interactionCreate")
  @UseGuards(MessageFromUserGuard)
  @UsePipes(MessageToUpperPipe)
  async onInteractionCreate(interaction: Interaction): Promise<void> {
    try {
      if (interaction.isButton()) {
        // handle wfh button
        if (interaction.customId.startsWith("komu_")) {
          await this.wfhService
            .wfh(interaction, this.client)
            .catch(console.error);
          return;
        }
        if (interaction.customId.startsWith("workout_")) {
          await this.workoutService
            .workout(interaction, this.client)
            .catch(console.error);
          return;
        }
        if (interaction.customId.startsWith("question_")) {

          await (interaction as ButtonInteraction).deferReply();

          const { id, key, correct, userid } = queryString.parse(
            interaction.customId
          );
          // Clear Button
          await interaction.message.edit({
            components: [],
          });

          await this.userRepository.update(
            { userId: userid as string },
            {
              botPing: false,
            }
          );

          if (key == correct) {
            const newUser = await this.quizService.addScores(userid);
            if (!newUser) return;
            await this.quizService.saveQuestionCorrect(userid, id, key);

            const EmbedCorrect = new EmbedBuilder()
              .setTitle(`Correct!!!, you have ${newUser[0].scores_quiz} points`)
              .setColor("Green");
            const btnCorrect = new EmbedBuilder()
              .setColor("#e11919")
              .setTitle("Complain")
              .setURL(`http://quiz.nccsoft.vn/question/update/${id}`);
            await interaction
              .editReply({ embeds: [EmbedCorrect, btnCorrect] })
              .catch((err) => {
                this.komubotrestService.sendErrorToDevTest(
                  this.client,
                  userid,
                  err
                );
              });
          } else {
            await this.quizService.saveQuestionInCorrect(userid, id, key);
            const EmbedInCorrect = new EmbedBuilder()
              .setTitle(`Incorrect!!!, The correct answer is ${correct}`)
              .setColor("Red");
            const btnInCorrect = new EmbedBuilder()
              .setColor("#e11919")
              .setTitle("Complain")
              .setURL(`http://quiz.nccsoft.vn/question/update/${id}`);

            await interaction
              .editReply({ embeds: [EmbedInCorrect, btnInCorrect] })
              .catch((err) => {
                this.komubotrestService.sendErrorToDevTest(
                  this.client,
                  userid,
                  err
                );
              });
          }
        }
        //   if (interaction.customId.startsWith("8/3_")) {
        //     await interaction.message.edit({
        //       components: [],
        //     });

        //     const { userid } = queryString.parse(interaction.customId);

        //     const randomIndex = () => {
        //       const min = 0;
        //       const max = 5;
        //       const intNumber = Math.floor(Math.random() * (max - min)) + min;
        //       return intNumber;
        //     };

        //     const gift = [
        //       "tà tưa fun tốp ping trị giá 4.38$",
        //       "một bé gấu bông sô ciu giá 8.76$",
        //       "cái nịt",
        //       "cái nịt",
        //       "cái nịt",
        //     ];

        //     let giftRandom = gift[randomIndex()];

        //     if (
        //       giftRandom === "tà tưa fun tốp ping trị giá 4.38$" ||
        //       giftRandom === "một bé gấu bông sô ciu giá 8.76$"
        //     ) {
        //       const newGift = new womenDayData({
        //         userid: userid,
        //         win: true,
        //         gift: giftRandom,
        //       });
        //       await newGift.save();
        //     } else {
        //       const newGift = new womenDayData({
        //         userid: userid,
        //         win: false,
        //         gift: giftRandom,
        //       });
        //       await newGift.save();
        //     }

        //     interaction.reply(`Chúc mừng bạn nhận được ${giftRandom}`);

        //     await sendMessageToNhaCuaChung(
        //       client,
        //       `Chúc mừng <@!${userid}> đã nhận được món quà 8/3 siêu to khổng lồ đó là ${giftRandom}`
        //     );
        //   }
        // }
        // if (!interaction.isCommand()) return;
        // const slashcmdexec = this.client.slashexeccommands.get(interaction.commandName);
        // // await interaction.deferReply();
        // if (slashcmdexec != null && slashcmdexec != undefined) {
        //   slashcmdexec(interaction, client).catch(console.error);
        // } else {
        //   await interaction.reply({
        //     content: "`❌` Slash commands are under construction.\n",
        //     ephemeral: true,
        //   });
      }
      // await interaction.editReply("Done");
    } catch (e) {
      console.log(e);
    }
  }

  @On("guildCreate")
  @UseGuards(MessageFromUserGuard)
  @UsePipes(MessageToUpperPipe)
  async onGuildCreate(guild: Guild): Promise<void> {
    console.log(
      "[32m%s[0m",
      "NEW GUILD ",
      "[0m",
      `${guild.name} [${guild.memberCount.toLocaleString()} Members]\nID: ${guild.id
      }`
    );
    const channel = guild.channels.cache.find(
      (c) =>
        c.permissionsFor((guild as any).me).has("SEND_MESSAGES" as any) &&
        c.permissionsFor((guild as any).me).has("EMBED_LINKS" as any) &&
        c.type === ("text" as any)
    );
  }

  @On("guildDelete")
  @UseGuards(MessageFromUserGuard)
  @UsePipes(MessageToUpperPipe)
  async onGuildDelete(guild: Guild): Promise<void> {
    console.log("[32m%s[0m", "OLD GUILD ", "[0m", `${guild.name}`);
    //không có env
    // await guild
    //   .fetchOwner()
    //   .then((o) => {
    //     this.clientConfigService.users.cache
    //       .get(o.id)
    //       .send(
    //         ":broken_heart: | I'm sad to see that you no longer need me in your server. Please consider giving feedback to my developer so I can improve!\n\nQuick links:\n> Dashboard: **https://komu.vn/**\n> Server: https://discord.gg/SQsBWtjzTv"
    //       );
    //   })
    //   .catch(() => console.log("Could not dm owner"));
  }
}
