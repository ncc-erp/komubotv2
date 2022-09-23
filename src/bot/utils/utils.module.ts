import { DiscordModule } from "@discord-nestjs/core";
import { forwardRef, Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportCommand } from "../commands/report/report.command";
import { Daily } from "../models/daily.entity";
import { Holiday } from "../models/holiday.entity";
import { Opentalk } from "../models/opentalk.entity";
import { Order } from "../models/order.entity";
import { User } from "../models/user.entity";
import { WorkFromHome } from "../models/wfh.entity";
import { KomubotrestController } from "./komubotrest/komubotrest.controller";
import { ReportDailyModule } from "./reportDaily/report-daily.module";
import { ReportDailyService } from "./reportDaily/report-daily.service";
import { ReportHolidayModule } from "./reportHoliday/reportHoliday.module";
import { ReportHolidayService } from "./reportHoliday/reportHoliday.service";
import { ReportMentionModule } from "./reportMention/reportMention.module";
import { ReportMentionService } from "./reportMention/reportMention.service";
import { ReportOpenTalkModule } from "./reportOpentalk/reportOpentalk.module";
import { ReportOpenTalkService } from "./reportOpentalk/reportOpentalk.service";
import { ReportOrderModule } from "./reportOrder/reportOrder.module";
import { ReportOrderService } from "./reportOrder/reportOrder.service";
import { ReportWFHModule } from "./reportWFH/report-wfh.module";
import { UtilsService } from "./utils.service";

@Module({
  imports: [
    DiscordModule.forFeature(),
    DiscoveryModule,
    TypeOrmModule.forFeature([
      Holiday,
      Opentalk,
      Order,
      Holiday,
      WorkFromHome,
      Daily,
      User,
    ]),
    ReportOrderModule,
    ReportHolidayModule,
    ReportOpenTalkModule,
    ReportWFHModule,
    ReportDailyModule,
    UtilsModule,
    ReportMentionModule,
  ],
  providers: [
    ReportCommand,
    ReportHolidayService,
    ReportOpenTalkService,
    ReportOrderService,
    ReportDailyService,
    ReportMentionService,
    UtilsService,
    KomubotrestController,
  ],
})
export class UtilsModule {}
