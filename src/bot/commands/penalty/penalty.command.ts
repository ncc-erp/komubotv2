import { Message, Client, EmbedBuilder, User } from "discord.js";
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
  cat: 'komu',
})
export default class PenaltyCommand implements CommandLineClass {
  constructor(private PenaltyService: PenaltyService) {}

  async execute(message: Message, args, _, __, ___, dataSource: DataSource) {
    const penaltyData = dataSource.getRepository(Penalty);
    try {
      const authorId = message.author.id;
      if (args[0] === "help") {
        return message.channel.send(messHelp);
      } else if (args[0] === "summary") {
        // await dataSource
        //   .createQueryBuilder()
        //   .insert()
        //   .into(User)
        //   .values([
        //     { is_reject: false },
        //     { channel_id: message.channel.id },
        //   ])
        //   .execute();

        // const aggregatorOpts = [
        //   {
        //     where: {
        //       is_reject: false,
        //       channel_id: message.channel.id,
        //       delete: false,
        //     },
        //   },
        //   {
        //     andWhere: {
        //       id: "user_id",
        //       amount: "$ammount",
        //       username: "$username",
        //     },
        //   },
        //   {
        //     $sort: {
        //       amount: -1,
        //     },
        //   },
        // ];

        // const result = await this.PenaltyService(aggregatorOpts);

        // let mess;
        // if (Array.isArray(result) && result.length === 0) {
        //   mess = "```" + "no result" + "```";
        // } else {
        //   mess = result
        //     .map((item) => `<@${item.id}>(${item.username}) : ${item.ammount}`)
        //     .join("\n");
        // }

      //   return message.channel
      //     .send("```" + "Top bị phạt :" + "\n" + "```" + "\n" + mess)
      //     .catch(console.error);
      // } else if (args[0] === "detail") {
      //   // detail
      //   let checkMention = message.mentions.members.first();

      //   if (!checkMention) return message.channel.send(messHelp);
      //   let dataPen;
      //   if (checkMention.user.id) {
      //     dataPen = await penaltyData.insert({
      //       user_id: checkMention.user.id,
      //       channel_id: message.channel.id,
      //     });
      //   } else {
      //     dataPen = await penaltyData.insert({
      //       username: checkMention.user.username,
      //       channel_id: message.channel.id,
      //     });
      //   }

        // if (!dataPen || (Array.isArray(dataPen) && dataPen.length === 0)) {
        //   return message.channel.send("```" + "no result" + "```");
        // }
      //   const mess = dataPen
      //     .map(
      //       (item, index) => `${index + 1} - ${item.reason} (${item.ammount})`
      //     )
      //     .join("\n");
      //   return message.channel
      //     .send(
      //       "```" + `Lý do ${dataPen[0].username} bị phạt` + "\n" + mess + "```"
      //     )
      //     .catch(console.error);
      // } else if (args[0] === "clear") {
      //   // clear
      //   await penaltyData.insert(
      //     {
      //       channel_id: message.channel.id,
      //       // delete: { $ne: true },
      //     }
      //     // { delete: true }
      //   );
      //   message
      //     .reply({
      //       content: "Clear penatly successfully",
      //     })
      //     .catch((err) => {
      //       sendErrorToDevTest(Client, authorId, err);
      //     });
      // } else {
      //   if (!args[0] || !args[1] || !args[2]) {
      //     return message.channel.send(messHelp);
      //   }
      //   const userArgs = message.mentions.members.first();
      //   // tien
      //   const ammount = transAmmount(args[1]);

      //   if (!ammount || !userArgs) {
      //     return message.channel.send(messHelp);
      //   }
        //li do
        // const reason = args.slice(2, args.length).join(" ");
        // let user = message.author.id;
        // const userChannel = userArgs?.user.id;
        // if (!user) return message.channel.send("```" + "no result" + "```");
        // console.log("user mess", user);
        // console.log("user in channel", userChannel);
        // if (userChannel) {
        // await this.PenaltyService.addUserIntoPenalty(
        //   message,
        //   {
        //     ammount: +ammount,
        //     reason: reason,
        //   },
        //   userChannel,
        //   userArgs?.user.username
        // );
        // return message
        //   .reply({ content: "`✅` Penalty saved." })
        //   .catch((err) => {
        //     sendErrorToDevTest(Client, authorId, err);
        //   });
        // }
        // else {
        //   return message.reply({ content: "User not exit in channel" });
        // }

        // const embed = new MessageEmbed()
        //   .setColor("#0099ff")
        //   .setTitle("PENALTY")
        //   .setDescription(
        //     `You have been fined by ${message.author.username} ${ammount} for: ${reason}`
        //   );

        //   const row = new MessageActionRow().addComp onents(
        //     new MessageButton()
        //       .setCustomId(`rejectpenalty${newPenatlyData.}`)
        //       .setLabel("REJECT")
        //       .setStyle("DANGER")
        //   );

        //   const userSend = await sendErrorToDevTest(
        //     Client,
        //     {
        //       components: [row],
        //       embeds: [embed],
        //     },
        //     user.username
        //   );
        //   const filter = (interaction) =>
        //     interaction.customId === `rejectpenalty${newPenatlyData.splice}`;

        //   let interaction;
        //   try {
        //     interaction = await userSend.dmChannel.awaitMessageComponent({
        //       filter,
        //       max: 1,
        //       time: 86400000,
        //       errors: ["time"],
        //     });
        //   } catch (error) {
        //     console.log(error);
        //   }

        //   if (interaction) {
        //     message.channel
        //       .send(`<@!${user.id}>(${user.username}) reject penalty`)
        //       .catch(console.error);
        //     await interaction.reply("Rejection sent!!!").catch((err) => {
        //       sendErrorToDevTest(Client, authorId, err);
        //     });
        //     await penaltyData.save(
        //       { id: newPenatlyData. }
        //       // {
        //       //   is_reject: true,
        //       // }
        //     );
        //   }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
