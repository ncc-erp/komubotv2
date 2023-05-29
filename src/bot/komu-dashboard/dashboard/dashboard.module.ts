import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Daily } from "src/bot/models/daily.entity";
import { DiscordModule } from "@discord-nestjs/core";
import { User } from "src/bot/models/user.entity";
import { Meeting } from "src/bot/models/meeting.entity";
import { Msg } from "src/bot/models/msg.entity";
import { Channel } from "src/bot/models/channel.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Daily, User, Meeting, Msg, Channel]),
    DiscordModule.forFeature(),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
