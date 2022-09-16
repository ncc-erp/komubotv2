import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { Penalty } from "src/bot/models/penatly.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Message } from "discord.js";

interface IPenalty {
  ammount: number;
  reason: string;
}

@Injectable()
export class PenaltyService {
  constructor(
    @InjectRepository(Penalty)
    private penaltyRepository: Repository<Penalty>
  ) {}
  async addUserIntoPenalty(
    message: Message,
    { ammount, reason }: IPenalty,
    user_id: string,
    username: string
  ) {
    await this.penaltyRepository
      .createQueryBuilder()
      .insert()
      .into(Penalty)
      .values({
        user_id: user_id,
        username: username,
        ammount: +ammount,
        reason: reason,
        createdTimestamp: new Date(),
        is_reject: false,
        channel_id: message.channel.id,
        delete: false,
      })
      .execute();
  }

  async findlistUserRoomMention(room, currentYear) {
    return await this.penaltyRepository
      .createQueryBuilder(TABLE.PENATLY)
      .where(`"user_id" = :user_id`, { room: room })
      .andWhere(`"year" = :year`, { year: currentYear })
      .getMany();
  }

  async aggregatorOpts(message) {
    return await this.penaltyRepository
      .createQueryBuilder(TABLE.PENATLY)
      .where("is_reject = :is_reject", { registered: false })
      .andWhere("channel_id =:channel_id", { channel_id: message.channel.id })
      .groupBy("peanalty.user_id");
  }
}
