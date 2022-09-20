import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "discord.js";
import { TABLE } from "src/bot/constants/table";
import { Daily } from "src/bot/models/daily.entity";
import { Repository } from "typeorm";
@Injectable()
export class DailyService {
  constructor(
    @InjectRepository(Daily) private dailyRepository: Repository<Daily>
  ) {}

  async saveDaily(message: Message, args: string[]) {
    await this.dailyRepository
      .createQueryBuilder(TABLE.DAILY)
      .insert()
      .into(Daily)
      .values({
        userid: message.author.id,
        email:
          message.member != null || message.member != undefined
            ? message.member.displayName
            : message.author.username,
        daily: args.join(" "),
        createdAt: new Date(),
        channelid: message.channel.id,
      })
      .execute();
  }
}
