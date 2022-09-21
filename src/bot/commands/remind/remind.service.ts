import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "discord.js";
import { TABLE } from "src/bot/constants/table";
import { Remind } from "src/bot/models/remind.entity";
import { Repository } from "typeorm";
@Injectable()
export class RemindService {
  constructor(
    @InjectRepository(Remind) private remindRepository: Repository<Remind>
  ) {}

  async saveDaily(message: Message, args: string[]) {
    await this.remindRepository
      .createQueryBuilder(TABLE.REMIND)
      .insert()
      .into(Remind)
      .values({
        channelId: message.channel.id,
        mentionUserId: message.author.id,
        authorId: message.author.id,
        content: message.author.id,
        cancel: false,
        // createdTimestamp: new Date(),
      })
      .execute();
  }
}
