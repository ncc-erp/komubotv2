import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Daily } from "src/bot/models/daily.entity";
import { Holiday } from "src/bot/models/holiday.entity";
import { Msg } from "src/bot/models/msg.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { UtilsService } from "../utils.service";
import { ReportDailyService } from "./report-daily.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Daily, Holiday, User, Msg, WorkFromHome]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [ReportDailyService, UtilsService, KomubotrestService],
})
export class ReportDailyModule {}
