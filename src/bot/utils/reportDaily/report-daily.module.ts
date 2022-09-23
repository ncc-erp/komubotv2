import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Daily } from "src/bot/models/daily.entity";
import { Holiday } from "src/bot/models/holiday.entity";
import { User } from "src/bot/models/user.entity";
import { UtilsService } from "../utils.service";
import { ReportDailyService } from "./report-daily.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Daily, Holiday, User]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [ReportDailyService, UtilsService],
})
export class ReportDailyModule {}
