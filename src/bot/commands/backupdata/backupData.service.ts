import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "discord.js";
import { TABLE } from "src/bot/constants/table";
import { Daily } from "src/bot/models/daily.entity";
import { VoiceChannels } from "src/bot/models/voiceChannel.entity";
import { Repository } from "typeorm";
@Injectable()
export class BackupService {
  constructor(
    @InjectRepository(Daily) private dailyRepository: Repository<Daily>,
    @InjectRepository(VoiceChannels)
    private voiceChannelRepository: Repository<VoiceChannels>
  ) {}

  async saveVoiechannel(item) {
    await this.voiceChannelRepository.insert({
      voiceChannelId: item.id,
      originalName: item.originalName,
      newRoomName: item.newRoomName,
      people: item.people,
      status: item.status,
      createdTimestamp: +item.createdTimestamp,
    });
  }
}
