import { DiscordModule } from "@discord-nestjs/core";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportCommand } from "../commands/report/report.command";
import { Tx8Command } from "../commands/tx8/tx8.command";
import { ClientConfigService } from "../config/client-config.service";
import { Channel } from "../models/channel.entity";
import { CheckCamera } from "../models/checkCamera.entity";
import { Daily } from "../models/daily.entity";
import { Holiday } from "../models/holiday.entity";
import { Msg } from "../models/msg.entity";
import { Opentalk } from "../models/opentalk.entity";
import { Order } from "../models/order.entity";
import { TrackerSpentTime } from "../models/trackerSpentTime.entity";
import { TX8 } from "../models/tx8.entity";
import { User } from "../models/user.entity";
import { WorkFromHome } from "../models/wfh.entity";
import { WomenDay } from "../models/womenDay.entity";
import { getApiWfhModule } from "./getApiWfh/getApiWfh.module";
import { UserNotDailyService } from "./getUserNotDaily/getUserNotDaily.service";
import { KomubotrestService } from "./komubotrest/komubotrest.service";
import { OdinReportService } from "./odinReport/odinReport.service";
import { ReportCheckCameraService } from "./reportCheckCamera/reportCheckCamera.service";
import { ReportCheckoutService } from "./reportCheckout/reportCheckout.service";
import { ReportDailyModule } from "./reportDaily/report-daily.module";
import { ReportDailyService } from "./reportDaily/report-daily.service";
import { ReportHolidayModule } from "./reportHoliday/reportHoliday.module";
import { ReportHolidayService } from "./reportHoliday/reportHoliday.service";
import { ReportMentionModule } from "./reportMention/reportMention.module";
import { ReportMentionService } from "./reportMention/reportMention.service";
import { ReportMsgCountService } from "./reportMsgCount/reportMsgCount.service";
import { ReportOpenTalkModule } from "./reportOpentalk/reportOpentalk.module";
import { ReportOpenTalkService } from "./reportOpentalk/reportOpentalk.service";
import { ReportOrderModule } from "./reportOrder/reportOrder.module";
import { ReportOrderService } from "./reportOrder/reportOrder.service";
import { ReportScoreModule } from "./reportScore/report-score.module";
import { ReportScoreService } from "./reportScore/report-score.service";
import { ReportTrackerService } from "./reportTracker/reportTracker.service";
import { ReportWFHModule } from "./reportWFH/report-wfh.module";
import { ReportWomenDayModule } from "./reportWomenDay/reportWomenDay.module";
import { ReportWomenDayService } from "./reportWomenDay/reportWomenDay.service";
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
      WomenDay,
      TX8,
      CheckCamera,
      TrackerSpentTime,
      Msg,
      Channel,
    ]),
    ReportOrderModule,
    ReportHolidayModule,
    ReportOpenTalkModule,
    ReportWFHModule,
    ReportDailyModule,
    ReportScoreModule,
    UtilsModule,
    ReportMentionModule,
    ReportWomenDayModule,
    HttpModule,
    getApiWfhModule,
  ],
  providers: [
    ReportCommand,
    Tx8Command,
    ReportHolidayService,
    ReportOpenTalkService,
    ReportOrderService,
    ReportDailyService,
    ReportScoreService,
    ReportMentionService,
    UtilsService,
    KomubotrestService,
    ReportWomenDayService,
    ReportCheckoutService,
    ClientConfigService,
    ConfigService,
    ReportCheckCameraService,
    OdinReportService,
    ReportTrackerService,
    UserNotDailyService,
    ReportMsgCountService,
    getApiWfhModule,
  ],
})
export class UtilsModule {}
