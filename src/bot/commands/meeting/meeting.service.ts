import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Meeting } from "src/bot/models/meeting.entity";
import { VoiceChannels } from "src/bot/models/voiceChannel.entity";
import { Repository } from "typeorm";

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
    @InjectRepository(VoiceChannels)
    private readonly voiceChannelRepository: Repository<VoiceChannels>
  ) {}

  async getListCalender(channelId) {
    return await this.meetingRepository
      .createQueryBuilder("meeting")
      .where(`"channelId" = :channelId`, { channelId: channelId })
      .andWhere(`"cancel" IS NOT true`)
      .select(`meeting.*`)
      .execute();
  }

  async findStatusVoice() {
    const test = await this.voiceChannelRepository.findBy({ status: "start" });
    return test;
  }

  async cancelMeetingById(id) {
    return await this.meetingRepository
      .createQueryBuilder("meeting")
      .update(Meeting)
      .set({
        cancel: true,
      })
      .where(`"id" = :id`, { id: id })
      .execute();
  }
}
