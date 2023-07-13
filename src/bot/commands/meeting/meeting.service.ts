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

  validateRepeatTime(repeatTime) {
    return repeatTime.length === 0 || /^[0-9]+$/.test(repeatTime);
  }

  validateDate(checkDate) {
    const dateRegex =
      /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/;
    return dateRegex.test(checkDate);
  }

  validateTime(checkTime) {
    const timeRegex = /(2[0-3]|[01][0-9]):[0-5][0-9]/;
    return timeRegex.test(checkTime);
  }

  validateRepeat(repeat) {
    const validRepeatValues = ["once", "daily", "weekly", "repeat", "monthly"];
    return validRepeatValues.includes(repeat);
  }

  async saveMeeting(channel_id, task, timestamp, repeat, repeatTime) {
    await this.meetingRepository.insert({
      channelId: channel_id,
      task: task,
      createdTimestamp: timestamp,
      repeat: repeat,
      repeatTime: repeatTime,
    });
  }
}
