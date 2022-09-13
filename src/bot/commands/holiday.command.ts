import { InjectRepository } from "@nestjs/typeorm";
import { Message, Client } from "discord.js";
import { DataSource, Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../base/command.base";
import { Holiday } from "../models/holiday.entity";
// import { sendErrorToDevTest } from "../utils/komubotrest.utils";

const messHelp = "```" + "*holiday register dd/MM/YYYY content" + "```";
@CommandLine({
  name: "holiday",
  description: "Holiday",
})
export default class holidayCommand implements CommandLineClass {
  constructor(
    @InjectRepository(Holiday)
    private leaveReposistory: Repository<Holiday>
  ) {}
  async execute(
    message: Message,
    args,
    client,
    __,
    ___,
    dataSource: DataSource
  ) {
    try {
      const holidayData = this.leaveReposistory;
      let authorId = message.author.id;
      if (!args[0] && !args[1] && !args[2]) {
        return message.channel.send(messHelp);
      }

      const dateTime = args.slice(1, 2).join(" ");
      const messageHoliday = args.slice(2).join(" ");
      if (
        !/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/.test(
          dateTime
        )
      ) {
      }

      await holidayData
        .insert({
          dateTime: dateTime,
          content: messageHoliday,
        })
        .catch((err) => console.log(err));
      message.reply({ content: "`✅` holiday saved." }).catch((err) => {
        // sendErrorToDevTest(client, authorId, err);
      });
    } catch (err) {
      console.log(err);
    }
  }
}
