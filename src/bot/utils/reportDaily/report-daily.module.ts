import { DiscordModule } from "@discord-nestjs/core";
import { HttpModule, HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { Channel } from "src/bot/models/channel.entity";
import { Daily } from "src/bot/models/daily.entity";
import { Holiday } from "src/bot/models/holiday.entity";
import { Msg } from "src/bot/models/msg.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { UserNotDailyService } from "../getUserNotDaily/getUserNotDaily.service";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { UtilsService } from "../utils.service";
import { ReportDailyService } from "./report-daily.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Daily,
      Holiday,
      User,
      Msg,
      WorkFromHome,
      Channel,
    ]),
    DiscordModule.forFeature(),
    DiscoveryModule,
    HttpModule,
  ],
  providers: [
    ReportDailyService,
    UtilsService,
    KomubotrestService,
    ClientConfigService,
    ConfigService,
    UserNotDailyService,
  ],
})
export class ReportDailyModule {}
