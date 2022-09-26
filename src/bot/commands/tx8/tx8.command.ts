import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { TABLE } from "src/bot/constants/table";
import { TX8 } from "src/bot/models/tx8.entity";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { UtilsService } from "src/bot/utils/utils.service";
import { Repository } from "typeorm";

@CommandLine({
  name: "tx8",
  description: "YEP lucky draw",
})
export class Tx8Command implements CommandLineClass {
  constructor(
    private komubotrestService: KomubotrestService,
    private readonly utilsService: UtilsService,
    @InjectRepository(TX8)
    private readonly tx8Repository: Repository<TX8>
  ) {}
  async execute(message: Message, args, client, authorId) {
    try {
      const userId = message.author.id;

      if (args.length == 0) {
        return message
          .reply({
            content: "```please add your lucky draw number (100 - 999)```",
            //   ephemeral: true,
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      }

      if (args.length == 1 && args[0] != "draw") {
        const tx8Number = args[0];

        if (
          isNaN(tx8Number) ||
          tx8Number >>> 0 !== parseFloat(tx8Number) ||
          tx8Number < 100 ||
          tx8Number > 999
        ) {
          message
            .reply({
              content: "Please enter a number between 100 and 999",
              // ephemeral: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
          return;
        }

        await this.tx8Repository.insert({
          messageId: message.id,
          userId: userId,
          tx8number: tx8Number,
          status: "pending",
          createdTimestamp: message.createdTimestamp,
        });
        message
          .reply({
            content: "`✅` Lucky number saved.",
            //   ephemeral: true,
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
        return;
      }

      if (
        userId != "694732284116598797" &&
        userId != "871713984670216273" &&
        args[0] == "draw"
      ) {
        message
          .reply({
            content: "```You are not allowed to use this command.```",
            //   ephemeral: true,
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
        return;
      }

      if (args[0] == "draw") {
        const now = new Date();
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const starttime = startOfDay.getTime() + 8 * 3600000;
        const endtime = starttime + 12 * 3600000;
        //   const aggregatorOpts = [
        //     {
        //       $match: {
        //         status: 'pending',
        //         createdTimestamp: {
        //           $gte: starttime,
        //           $lt: endtime,
        //         },
        //         tx8number: {
        //           $gte: 99,
        //           $lt: 1000,
        //         },
        //       },
        //     },
        //     {
        //       $group: {
        //         _id: '$userId',
        //         lastId: { $last: '$_id' },
        //         tx8number: { $last: '$tx8number' },
        //         createdTimestamp: { $last: '$createdTimestamp' },
        //       },
        //     },
        //     {
        //       $project: {
        //         _id: '$lastId',
        //         userId: '$_id',
        //         tx8number: 1,
        //         createdTimestamp: 1,
        //       },
        //     },
        //     {
        //       $lookup: {
        //         from: 'komu_users',
        //         localField: 'userId',
        //         foreignField: 'id',
        //         as: 'user',
        //       },
        //     },
        //     {
        //       $sort: {
        //         createdTimestamp: -1,
        //       },
        //     },
        //   ];

        // const aggregatorOpts =

        //can join bang user
        const data = await this.tx8Repository
          .createQueryBuilder(TABLE.TX8)
          .where(`${TABLE.TX8}.status = :status`, { status: "pending" })
          .andWhere(`${TABLE.TX8}.createdTimestamp > ${starttime}`)
          .andWhere(`${TABLE.TX8}.createdTimestamp < ${endtime}`)
          .andWhere(`${TABLE.TX8}.tx8number > 99`)
          .andWhere(`${TABLE.TX8}.tx8number < 100`)
          .groupBy(`${TABLE.TX8}.tx8number`)
          .addGroupBy(`${TABLE.TX8}.createdTimestamp`)
          .orderBy(`${TABLE.TX8}.createdTimestamp`, "ASC")
          .execute();
        if (data.length == 0) {
          message
            .reply({
              content: "```No lucky number found```",
              // ephemeral: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
          return;
        }
        const rndNumber = Math.floor(Math.random() * data.length);
        const tx8Number = data[rndNumber].tx8number;

        //   await tx8Data.updateMany(
        //     { userId: data[rndNumber].userId },
        //     { status: 'done' }
        //   );

        await this.tx8Repository
          .createQueryBuilder()
          .update(TABLE.TX8)
          .set({
            userId: data[rndNumber].userId,
            status: "done",
          })
          .execute();
        message
          .reply({
            content: `\`🎉\` Lucky number is \`${tx8Number}\` by \`${data[rndNumber].user[0].email}\``,
            //   ephemeral: false,
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      }
    } catch (err) {
      console.log(err);
      message
        .reply({
          content: "```Error```",
          //   ephemeral: true
        })
        .catch((err) => {
          this.komubotrestService.sendErrorToDevTest(client, authorId, err);
        });
    }
  }
}
