import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Holiday } from "src/bot/models/holiday.entity";
import { User } from "src/bot/models/user.entity";
import { UtilsService } from "../utils.service";
import { ReportScoreService } from "./report-score.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Holiday, User]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [ReportScoreService, UtilsService],
})
export class ReportScoreModule {}
