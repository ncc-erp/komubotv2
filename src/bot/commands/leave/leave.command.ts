<<<<<<< HEAD
import { Message,  } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { sendErrorToDevTest } from "src/bot/untils/komu.until";
import { DataSource, Repository } from "typeorm";
import { LeaveService } from "./leave.service";


@CommandLine({
    name: "leave",
    description: "leave",
})
export default class LeaveCommand implements CommandLineClass {
    constructor(
        private leaveService: LeaveService
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
            await this.leaveService.saveLeave(message.channel.id, authorId, minute, reason);

            return message.reply("✅ Leave saved").catch((err) => {
                sendErrorToDevTest(Client, authorId, err);
            });
        } catch (err) {
            console.log(err);
        }
    }
=======
import { InjectRepository } from "@nestjs/typeorm";
import { Message, Client, EmbedBuilder } from "discord.js";
import { getTomorrowDate, getYesterdayDate } from "../../utils/date.utils";
import { DataSource, Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../../base/command.base";

import { Leave } from "../../models/leave.entity";
import { TABLE } from "../../constants/table";
import { LeaveService } from "./leave.service";
import { KomubotrestController } from "src/bot/utils/komubotrest/komubotrest.controller";

@CommandLine({
  name: "leave",
  description: "leave",
})
export default class LeaveCommand implements CommandLineClass {
  constructor(
    private readonly leaveService: LeaveService,  private komubotrestController : KomubotrestController,
  ) {}

  async execute(message: Message, args, Client) {
    try {
      let authorId = message.author.id;
      if (!args[0] || !args[1]) {
        return message
          .reply("```" + "*leave minute reason  " + "```")
          .catch((err) => {
            this.komubotrestController.sendErrorToDevTest(Client, authorId, err);
          });
      }
      const minute =
        !isNaN(parseFloat(args[0])) && !isNaN(args[0] - 0) && parseInt(args[0]);

      if (!minute) {
        return message.reply("Minute must be a number").catch((err) => {
          this.komubotrestController.sendErrorToDevTest(Client, authorId, err);
        });
      }
      const reason = args.slice(1, args.length).join(" ");
      await this.leaveService.saveLeave(message, {minute: minute, reason: reason})
      

      return message.reply("`✅` Leave saved").catch((err) => {
        this.komubotrestController.sendErrorToDevTest(Client, authorId, err);
      });
    } catch (err) {
      console.log(err);
    }
  }
>>>>>>> develop
}
