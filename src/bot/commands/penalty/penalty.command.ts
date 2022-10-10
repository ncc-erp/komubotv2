import { channel } from "diagnostics_channel";
import {
  Message,
  Client,
  EmbedBuilder,
  User,
  ActionRowBuilder,
  ButtonBuilder,
} from "discord.js";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { DataSource, Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../../base/command.base";
import { Penalty } from "../../models/penatly.entity";
import { PenaltyService } from "./penalty.service";

const transAmmount = (ammout) => {
  ammout = ammout.toLowerCase();
  const lastString = ammout.slice(ammout.length - 1, ammout.length);
  const startString = ammout.slice(0, ammout.length - 1);

  const checkNumber = (string) =>
    !isNaN(parseFloat(string)) && !isNaN(string - 0);

  if (lastString == "k" && checkNumber(startString)) {
    return startString * 1000;
  } else if (checkNumber(ammout)) {
    return checkNumber(ammout);
  }
};

const messHelp =
  "```" +
  "*penalty @username ammount<50k> reason" +
  "\n" +
  "*penalty summary" +
  "\n" +
  "*penalty detail @username" +
  "\n" +
  "*penalty clear" +
  "```";

@CommandLine({
  name: "penalty",
  description: "penalty",
  cat: "komu",
})
export default class PenaltyCommand implements CommandLineClass {
  constructor(
    private penaltyService: PenaltyService,
    private komubotrestService: KomubotrestService
  ) {}

  async execute(message: Message, args, client: Client, guildDB) {
    try {
      const authorId = message.author.id;
      if (args[0] === "help") {
        return message.channel.send(messHelp);
      } else if (args[0] === "summary") {
        const result = await this.penaltyService.findPenatly(
          message.channel.id
        );

        let mess;
        if (Array.isArray(result) && result.length === 0) {
          mess = "```" + "no result" + "```";
        } else {
          mess = result
            .map(
              (item) =>
                `<@${item.userId}>(${item.komu_penatly_username}) : ${item.ammount} vnd`
            )
            .join("\n");
        }

        return message.channel
          .send("```" + "Top bị phạt :" + "\n" + "```" + "\n" + mess)
          .catch(console.error);
      } else if (args[0] === "detail") {
        const checkMention = message.mentions.members.first();

        if (!checkMention) return message.channel.send(messHelp);
        let dataPen;
        if (checkMention.user.id) {
          dataPen = await this.penaltyService.findDataPenWithUserId(
            checkMention.user.id,
            message.channel.id
          );
        } else {
          dataPen = await this.penaltyService.findDataPenWithUsername(
            checkMention.user.username,
            message.channel.id
          );
        }

        if (!dataPen || (Array.isArray(dataPen) && dataPen.length === 0)) {
          return message.channel.send("```" + "no result" + "```");
        }
        const mess = dataPen
          .map(
            (item, index) =>
              `${index + 1} - ${item.komu_penatly_reason} (${
                item.komu_penatly_ammount
              })`
          )
          .join("\n");

        return message.channel
          .send(
            "```" +
              `Lý do ${dataPen[0].komu_penatly_username} bị phạt` +
              "\n" +
              mess +
              "```"
          )
          .catch(console.error);
      } else if (args[0] === "clear") {
        // clear
        await this.penaltyService.clearPenatly(message.channel.id);

        message
          .reply({
            content: "Clear penatly successfully",
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      } else {
        const channel_id = message.channel.id;
        if (!args[0] || !args[1] || !args[2]) {
          return message.channel.send(messHelp);
        }
        const userArgs = message.mentions.members.first();
        const ammount = transAmmount(args[1]);
        if (!ammount || !userArgs) {
          return message.channel.send(messHelp);
        }
        const reason = args.slice(2, args.length).join(" ");

        let users;
        if (userArgs?.user.id) {
          users = await this.penaltyService.findUserWithId(userArgs.user.id);
        } else {
          users = await this.penaltyService.findUserWithUsername(
            userArgs.user.username
          );
        }

        if (!users) return message.channel.send("```" + "no result" + "```");
        const newPenatlyData = await this.penaltyService.addNewPenatly(
          users[0].komu_user_userId,
          users[0].komu_user_username,
          ammount,
          reason,
          Date.now(),
          false,
          channel_id,
          false
        );
        message.reply({ content: "`✅` Penalty saved." }).catch((err) => {
          this.komubotrestService.sendErrorToDevTest(client, authorId, err);
        });
        const embed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle("PENALTY")
          .setDescription(
            `You have been fined by ${message.author.username} ${ammount} for: ${reason}`
          );
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`rejectpenalty${newPenatlyData[0].userId}`)
            .setLabel("REJECT")
            .setStyle(4)
        );
        const userSend = await this.komubotrestService.sendMessageKomuToUser(
          client,
          {
            components: [row],
            embeds: [embed],
          },
          users[0].komu_user_username
        );
        const filter = (interaction) =>
          interaction.customId === `rejectpenalty${newPenatlyData[0].userId}`;

        let interaction;
        try {
          interaction = await (
            userSend as User
          ).dmChannel.awaitMessageComponent({
            filter,
            // max: 1,
            time: 86400000,
            //  errors: ["time"],
          });
        } catch (error) {
          console.log("Error comehere ", error);
        }

        if (interaction) {
          message.channel
            .send(
              `<@!${users[0].komu_user_userId}>(${users[0].komu_user_username}) reject penalty`
            )
            .catch(console.error);
          await interaction.reply("Rejection sent!!!").catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
          await this.penaltyService.updateIsReject(newPenatlyData[0].id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
