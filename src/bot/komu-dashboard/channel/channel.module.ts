import { Module } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChannelController } from "./channel.controller";
import { Channel } from "src/bot/models/channel.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscordModule } from "@discord-nestjs/core";
import { GetNameChannelService } from "src/bot/utils/getFullNameChannel/getFullNameChannel.service";
import { User } from "src/bot/models/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Channel, User]), DiscordModule.forFeature()],
  controllers: [ChannelController],
  providers: [ChannelService, GetNameChannelService],
})
export class ChannelModule {}
