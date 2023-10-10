import { Module } from "@nestjs/common";
import { MeetingService } from "./meeting.service";
import { MeetingController } from "./meeting.controller";
import { Meeting } from "src/bot/models/meeting.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscordModule } from "@discord-nestjs/core";
import { GetNameChannelService } from "src/bot/utils/getFullNameChannel/getFullNameChannel.service";
import { User } from "src/bot/models/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, User]), DiscordModule.forFeature()],
  controllers: [MeetingController],
  providers: [MeetingService, GetNameChannelService],
})
export class MeetingModule {}
