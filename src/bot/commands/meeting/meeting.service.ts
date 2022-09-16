import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Meeting } from "src/bot/models/meeting.entity";
import { Repository } from "typeorm";

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>
  ) {}

  async cancelChannel(channelId) {
    return await this.meetingRepository
      .createQueryBuilder("meeting")
      .where(`"channelId" = :channelId`, { channelId: channelId })
      .andWhere(`"cancel"`, { cancel: true })
      .execute();
  }
}
