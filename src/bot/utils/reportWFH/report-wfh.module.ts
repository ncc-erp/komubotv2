import { DiscordModule } from "@discord-nestjs/core";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Channel } from "src/bot/models/channel.entity";
import { Daily } from "src/bot/models/daily.entity";
import { Holiday } from "src/bot/models/holiday.entity";
import { Msg } from "src/bot/models/msg.entity";
import { Uploadfile } from "src/bot/models/uploadFile.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { UserNotDailyService } from "../getUserNotDaily/getUserNotDaily.service";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { UtilsService } from "../utils.service";
import { ReportWFHService } from "./report-wfh.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkFromHome,
      Holiday,
      User,
      Msg,
      Channel,
      Daily,
      Uploadfile,
    ]),
    DiscordModule.forFeature(),
    HttpModule,
    DiscoveryModule,
  ],
  providers: [
    ReportWFHService,
    UtilsService,
    UserNotDailyService,
    KomubotrestService,
  ],
  exports: [ReportWFHService, UtilsService],
})
export class ReportWFHModule {}
