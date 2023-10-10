import { Module } from "@nestjs/common";
import { PenaltyService } from "./penalty.service";
import { PenaltyController } from "./penalty.controller";
import { Penalty } from "src/bot/models/penatly.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscordModule } from "@discord-nestjs/core";
import { GetNameChannelService } from "src/bot/utils/getFullNameChannel/getFullNameChannel.service";
import { User } from "src/bot/models/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Penalty, User]), DiscordModule.forFeature()],
  controllers: [PenaltyController],
  providers: [PenaltyService, GetNameChannelService],
})
export class PenaltyModule {}
