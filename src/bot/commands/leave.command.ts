import { InjectRepository } from "@nestjs/typeorm";
import { Message, Client, EmbedBuilder } from "discord.js";
<<<<<<< HEAD
import { getTomorrowDate, getYesterdayDate } from "../utils/date.utils";
import { DataSource, Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../base/command.base";

import { Leave } from "../models/leave.enity";
import { sendErrorToDevTest } from "../utils/komubotrest.utils";
import { TABLE } from "../constants/table";

interface ILeave {
  komu_leave_id: number;
  komu_leave_channelId: string;
  komu_leave_userId: string;
  komu_leave_reason: string;
  komu_leave_minute: number;
  komu_leave_createdAt: Date;
}
=======
// import { getTomorrowDate, getYesterdayDate } from "../utils/date.utils";
import { DataSource, Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../base/command.base";

// import { sendErrorToDevTest } from "../utils/komubotrest.utils";
import { TABLE } from "../constants/table";
import { Leave } from "../models/leave.entity";
>>>>>>> task/entity

@CommandLine({
  name: "leave",
  description: "leave",
})
export default class LeaveCommand implements CommandLineClass {
<<<<<<< HEAD
  constructor() {}

  async execute(message: Message, args, Client, _, __, dataSource: DataSource) {
    const leaveData = dataSource.getRepository(Leave);
=======
  constructor(
    @InjectRepository(Leave)
    private leaveReposistory: Repository<Leave>
  ) {}

  async execute(message: Message, args, Client, _, __, dataSource: DataSource) {
>>>>>>> task/entity
    try {
      let authorId = message.author.id;
      if (!args[0] || !args[1]) {
        return message
          .reply("```" + "*leave minute reason " + "```")
          .catch((err) => {
<<<<<<< HEAD
            sendErrorToDevTest(Client, authorId, err);
=======
            // sendErrorToDevTest(Client, authorId, err);
>>>>>>> task/entity
          });
      }
      const minute =
        !isNaN(parseFloat(args[0])) && !isNaN(args[0] - 0) && parseInt(args[0]);

      if (!minute) {
        return message.reply("Minute must be a number").catch((err) => {
<<<<<<< HEAD
          sendErrorToDevTest(Client, authorId, err);
        });
      }
      const reason = args.slice(1, args.length).join(" ");
      await leaveData.save({
=======
          // sendErrorToDevTest(Client, authorId, err);
        });
      }
      const reason = args.slice(1, args.length).join(" ");
      await this.leaveReposistory.save({
>>>>>>> task/entity
        channelId: message.channel.id,
        userId: authorId,
        minute,
        reason,
      });

<<<<<<< HEAD
      return message.reply("`✅` Leave saved").catch((err) => {
        sendErrorToDevTest(Client, authorId, err);
=======
      return message.reply("✅ Leave saved").catch((err) => {
        // sendErrorToDevTest(Client, authorId, err);
>>>>>>> task/entity
      });
    } catch (err) {
      console.log(err);
    }
  }
}
