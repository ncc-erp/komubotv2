import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "discord.js";
import { Repository } from "typeorm";

import { CommandLine, CommandLineClass } from "../base/command.base";
import { Daily } from "../models/daily.entity";

@CommandLine({
  name: "daily",
  description: "daily work",
})
export class DailyCommand implements CommandLineClass {
  constructor(
    @InjectRepository(Daily) private dailyRepository: Repository<Daily>
  ) {}
  async execute(message: Message, args) {
    try {
      let authorId = message.author.id;
      const daily = args.join(" ");
      if (!daily || daily == undefined) {
        return message
          .reply({
            content: "```please add your daily text```",
          })
          .catch((err) => {
            // sendErrorToDevTest(client, authorId, err);
          });
      }
      console.log({
        userid: message.author.id,
        email:
          message.member != null || message.member != undefined
            ? message.member.displayName
            : message.author.username,
        daily: daily,
        createdAt: new Date(),
        channelid: message.channel.id,
      });
      await this.dailyRepository.insert({
        userid: message.author.id,
        email:
          message.member != null || message.member != undefined
            ? message.member.displayName
            : message.author.username,
        daily: daily,
        createdAt: Date.now(),
        channelid: message.channel.id,
      });
      // if (!checkTimeSheet()) {
      //   message
      //     .reply({
      //       content:
      //         '```✅ Daily saved. (Invalid daily time frame. Please daily at 7h30-9h30, 12h-14h. WFH not daily 20k/day.)```',
      //       ephemeral: true,
      //     })
      //     .catch((err) => {
      //       sendErrorToDevTest(client, authorId, err);
      //     });
      // } else {
      message.reply({ content: "`✅` Daily saved." }).catch((err) => {
        // sendErrorToDevTest(client, authorId, err);
      });
      // }
    } catch (err) {
      console.log(err);
    }
    // },
  }
}
