import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "discord.js";
import { TABLE } from "src/bot/constants/table";
import { Leave } from "src/bot/models/leave.enity";
import { Repository } from "typeorm";

interface ILeave{
  minute: number,
  reason: string
}

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave) private leaveRepository: Repository<Leave>
  ) {}

  async saveLeave(message: Message, {minute, reason} : ILeave) {
    await this.leaveRepository
      .createQueryBuilder(TABLE.LEAVE)
      .insert()
      .into(Leave)
      .values({
        channelId: message.channel.id,
        userId: message.author.id,
        minute: +minute,
        reason: reason,
        createdAt: new Date()
      })
      .execute();
  }
}
