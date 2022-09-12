import { InjectRepository } from "@nestjs/typeorm";
import { Message, Client, EmbedBuilder } from "discord.js";
import { getTomorrowDate, getYesterdayDate } from "../utils/date.utils";
import { DataSource, Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../base/command.base";

import { sendErrorToDevTest } from "../utils/komubotrest.utils";
import { TABLE } from "../constants/table";
import { Leave } from "../models/leave.entity";

@CommandLine({
  name: "leave",
  description: "leave",
})
export default class LeaveCommand implements CommandLineClass {
  constructor(
    @InjectRepository(Leave)
    private leaveReposistory: Repository<Leave>
  ) {}

  async execute(message: Message, args, Client, _, __, dataSource: DataSource) {
    try {
      let authorId = message.author.id;
      if (!args[0] || !args[1]) {
        return message
          .reply("```" + "*leave minute reason " + "```")
          .catch((err) => {
            sendErrorToDevTest(Client, authorId, err);
          });
      }
      const minute =
        !isNaN(parseFloat(args[0])) && !isNaN(args[0] - 0) && parseInt(args[0]);

      if (!minute) {
        return message.reply("Minute must be a number").catch((err) => {
          sendErrorToDevTest(Client, authorId, err);
        });
      }
      const reason = args.slice(1, args.length).join(" ");
      await this.leaveReposistory.save({
        channelId: message.channel.id,
        userId: authorId,
        minute,
        reason,
      });

      return message.reply("✅ Leave saved").catch((err) => {
        sendErrorToDevTest(Client, authorId, err);
      });
    } catch (err) {
      console.log(err);
    }
  }
}
