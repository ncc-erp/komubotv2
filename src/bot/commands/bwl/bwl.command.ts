import { EmbedBuilder } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { firstValueFrom } from "rxjs";
import { getUserOffWork } from "src/bot/utils/getUserOffWork";
import { UtilsService } from "src/bot/utils/utils.service";

@CommandLine({
  name: "bwl",
  description: "BWL leaderboard",
  cat: "komu",
})
export class BWLCommand implements CommandLineClass {
  constructor(private utilsService: UtilsService) {}

  async execute(message, args) {
    try {
      if (args[0] === "help") {
        return message.channel.send(
          "```" +
            "*bwl channel_id top dd/mm/yyyy" +
            "\n" +
            "channel_id : right click to the channel & copy" +
            "```"
        );
      }

      const channelId = args[0] || message.channel.id;

      const top =
        (!isNaN(parseFloat(args[1])) &&
          !isNaN(args[1] - 0) &&
          parseInt(args[1])) ||
        5;
      const time = args[2];
      if (!channelId || !this.utilsService.getTimeWeek(time)) {
        return message.channel.send("```invalid channel or time```");
      }

        // const aggregatorOpts = [
        //   {
        //     $match: { channelId },
        //   },
        //   {
        //     $group: {
        //       _id: "$messageId",
        //       totalReact: { $addToSet: "$authorId" },
        //     },
        //   },
        //   {
        //     $project: {
        //       _id: 0,
        //       messageId: "$_id",
        //       totalReact: {
        //         $size: "$totalReact",
        //       },
        //     },
        //   },
        //   {
        //     $lookup: {
        //       from: "komu_bwls",
        //       localField: "messageId",
        //       foreignField: "messageId",
        //       as: "author_message",
        //     },
        //   },
        //   {
        //     $unwind: "$author_message",
        //   },
        //   {
        //     $lookup: {
        //       from: "komu_users",
        //       localField: "author_message.authorId",
        //       foreignField: "id",
        //       as: "author",
        //     },
        //   },
        //   {
        //     $unwind: "$author",
        //   },
        //   {
        //     $sort: { totalReact: -1 },
        //   },
        //   {
        //     $group: {
        //       _id: "$author.id",
        //       author: { $first: "$author" },
        //       message: { $first: "$author_message" },
        //       totalReact: { $first: "$totalReact" },
        //     },
        //   },
        //   {
        //     $match: {
        //       $and: [
        //         {
        //           "message.createdTimestamp": {
        //             $gte: getTimeWeek(time).firstday.timestamp,
        //           },
        //         },
        //         {
        //           "message.createdTimestamp": {
        //             $lte: getTimeWeek(time).lastday.timestamp,
        //           },
        //         },
        //       ],
        //     },
        //   },
        //   {
        //     $sort: { totalReact: -1 },
        //   },
        //   { $limit: top },
        // ];

        // bwlReactData
        //   .aggregate(aggregatorOpts)
        //   .exec()
        //   .then((docs) => {
        //     let name = [];
        //     if (docs.length) {
        //       name = docs.map((doc, index) => {
        //         return `Top ${index + 1} ${doc.author.username}: ${
        //           doc.totalReact
        //         } votes`;
        //       });
        //     }
        //     if (Array.isArray(name) && name.length === 0) {
        //       message.channel.send("```no result```");
        //     } else {
        //       message.channel
        //         .send(
        //           "```" +
        //             getTimeWeek(time).firstday.date +
        //             " - " +
        //             getTimeWeek(time).lastday.date +
        //             "\n" +
        //             name.join("\n") +
        //             "```"
        //         )
        //         .catch(console.error);
        //     }
        //   });
    } catch (e) {
      console.log(e);
    }
  }
}
