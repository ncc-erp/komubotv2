import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
<<<<<<< HEAD
<<<<<<< HEAD
import { ChecklistCommand } from "./commands/checklist/checklist.command";
=======
import { CompantripCommand } from "./commands/companytrip/companytrip.command";
import { CompanytripService } from "./commands/companytrip/companytrip.service";
>>>>>>> develop

import { DailyCommand } from "./commands/daily.command";
import { ElsaCommand } from "./commands/elsa/elsa.command";
import { ElsaService } from "./commands/elsa/elsa.service";
import holidayCommand from "./commands/holiday/holiday.command";
import { HolidayService } from "./commands/holiday/holiday.service";
=======
import { ChecklistCommand } from "./commands/checklist.command";
// import { CheckListModule } from "./commands/checklist/checklist.module";
import { CompantripCommand } from "./commands/companytrip/companytrip.command";

import { DailyCommand } from "./commands/daily.command";
>>>>>>> develop
import { MeetingCommand } from "./commands/meeting/meeting.command";
import { MeetingService } from "./commands/meeting/meeting.service";
import { RemindCommand } from "./commands/remind/remind.command";
import { UserStatusCommand } from "./commands/user_status/user_status.command";
import { UserStatusService } from "./commands/user_status/user_status.service";
import { WFHCommand } from "./commands/wfh/wfh.command";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule as NestjsScheduleModule } from "@nestjs/schedule";
import { TimeSheetCommand } from "./commands/timesheet/timesheet.command";
import { BotGateway } from "./events/bot.gateway";
import { Daily } from "./models/daily.entity";
import { Holiday } from "./models/holiday.entity";
import { Leave } from "./models/leave.entity";
import { Meeting } from "./models/meeting.entity";
import { Msg } from "./models/msg.entity";
import { Remind } from "./models/remind.entity";
import { User } from "./models/user.entity";
import { VoiceChannels } from "./models/voiceChannel.entity";
<<<<<<< HEAD
import { User } from "./models/user.entity";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
import { RequestOrder } from "./untils/requestorder.until";
import { CheckListController } from "./commands/checklist/checklist.controller";
import { CheckListService } from "./commands/checklist/checklist.service";
import { CheckList } from "./models/checklist.entity";
import { Subcategorys } from "./models/subcategoryData.entity";
import { CompanyModule } from "./commands/companytrip/companytrip.module";
import { GemrankCommand } from "./commands/gemrank/gemrank.command";
import { UntilService } from "./untils/until.service";
<<<<<<< HEAD
import { CompanytripService } from "./commands/Companytrip/companytrip.service";
import { CompanyTrip } from "./models/companyTrip.entity";
import { KomubotrestService } from "./untils/komubotrest/komubotrest.service";
import { Message } from "./models/msg.entity";
import { WorkFromHome } from "./models/wfh.entity";
import NotificationCommand from "./commands/notification/noti.controller";
import { NotifiService } from "./commands/notification/noti.service";
import { User } from "./models/user.entity";
import { WFHCommand } from "./commands/WFH/wfh.command";
import { ReportTracker } from "./untils/reportTracker";
=======
import { LeaveService } from "./commands/leave/leave.service";
import LeaveCommand from "./commands/leave/leave.command";
>>>>>>> develop
=======
import { WorkFromHome } from "./models/wfh.entity";
import { MeetingSchedulerService } from "./scheduler/meeting-scheduler/meeting-scheduler.service";
import { ReminderSchedulerService } from "./scheduler/reminder-scheduler/reminder-scheduler.service";
import { SendMessageSchedulerService } from "./scheduler/send-message-scheduler/send-message-scheduler.service";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
import { NotifiService } from "./commands/notification/noti.service";
import { ToggleActiveCommand } from "./commands/toggleActive/toggleActive.command";
import { ToggleActiveService } from "./commands/toggleActive/toggleActive.service";
import { CheckListModule } from "./utils/checklist/checklist.module";
import { MulterModule } from "@nestjs/platform-express";
import { UtilsModule } from "./utils/utils.module";
import { GemrankCommand } from "./commands/gemrank.command";
import { MoveChannelCommand } from "./commands/move_channel/move_channel.command";
import LeaveCommand from "./commands/leave/leave.command";
import { LeaveService } from "./commands/leave/leave.service";
import { ReportWFHModule } from "./utils/reportWFH/report-wfh.module";
import { PollCommand } from "./commands/poll/poll.command";
import { PollEmbedUntil } from "./utils/poll/pollEmbed.until";
import { ConfigService } from "@nestjs/config";
import { Opentalk } from "./models/opentalk.entity";
import { Uploadfile } from "./models/uploadFile.entity";
import { ReportOrderModule } from "./utils/reportOrder/reportOrder.module";
import { ReportCommand } from "./commands/report/report.command";
import { ReportOrderService } from "./utils/reportOrder/reportOrder.service";
import { UtilsService } from "./utils/utils.service";
// import { ReportOrder } from "./utils/reportOrder.utils";
import HolidayCommand from "./commands/holiday/holiday.command";
import { Order } from "./models/order.entity";
import { HolidayService } from "./commands/holiday/holiday.service";
import Ncc8Command from "./commands/ncc8/ncc8.command";
// import { CheckListController } from "./commands/Checklist/checklist.controller";
import { CompanyTrip } from "./models/companyTrip.entity";
import { CompanytripService } from "./commands/companytrip/companytrip.service";
import { PingCommand } from "./commands/ping/ping";
import { KomubotrestController } from "./utils/komubotrest/komubotrest.controller";
import { OpenTalkService } from "./commands/open-talk/open-talk.service";
import NotificationCommand from "./commands/notification/noti.command";
import { OrderCommand } from "./commands/order/order.command";
import { OrderService } from "./commands/order/order.service";
import { MoveChannelService } from "./commands/move_channel/move_channel.service";
import { CheckList } from "./models/checklistdata.entity";
import { Subcategorys } from "./models/subcategoryData.entity";
import { Channel } from "./models/channel.entity";
import { ReportTracker } from "./utils/report-tracker.untils";
import { ReportHolidayService } from "./utils/reportHoliday/reportHoliday.service";
import { ReportOpenTalkService } from "./utils/reportOpentalk/reportOpentalk.service";
import { AudioPlayer } from "./utils/audioPlayer.utils";
import { ReportDailyModule } from "./utils/reportDaily/report-daily.module";
import holidayCommand from "./commands/holiday.command";
import { ReportDailyService } from "./utils/reportDaily/report-daily.service";
import { ReportMentionModule } from "./utils/reportMention/reportMention.module";
import { ClientConfigService } from "./config/client-config.service";
import { ReportWomenDayService } from "./utils/reportWomenDay/reportWomenDay.service";
import { ReportWomenDayModule } from "./utils/reportWomenDay/reportWomenDay.module";
import { WomenDay } from "./models/womenDay.entity";
import { ReportCheckoutService } from "./utils/reportCheckout/reportCheckout.service";
import { ReportCheckoutModule } from "./utils/reportCheckout/reportCheckout.module";
import { UserNotDailyService } from "./utils/getUserNotDaily/getUserNotDaily.service";
>>>>>>> develop

@Module({
  imports: [
    DiscordModule.forFeature(),
    MulterModule.register({
      dest: "./files",
    }),
    DiscoveryModule,
    TypeOrmModule.forFeature([
<<<<<<< HEAD
      ElsaDaily,
      CheckList,
      Subcategorys,
      User,
=======
>>>>>>> develop
      Daily,
      Order,
      Leave,
      Holiday,
      User,
      Meeting,
      VoiceChannels,
<<<<<<< HEAD
      Message,
      WorkFromHome,
      ReportTracker,
    ]),
    TypeOrmModule.forFeature([Daily, Order, Leave, Holiday,CompanyTrip,User]),
=======
      WorkFromHome,
      Msg,
      Remind,
      Uploadfile,
      Opentalk,
      CompanyTrip,
      CheckList,
      Subcategorys,
      Channel,
      Daily,
      WomenDay,

    ]),
    // forwardRef(() => CheckListModule),
    CheckListModule,
    NestjsScheduleModule.forRoot(),
    HttpModule,
    UtilsModule,
    ReportWFHModule,
    ReportMentionModule,
    ReportWomenDayModule,
    ReportCheckoutModule,
>>>>>>> develop
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
    ChecklistCommand,
    CompantripCommand,
    CompanytripService,
    BotGateway,
    LeaveCommand,
    LeaveService,
    DailyCommand,
    MeetingCommand,
    holidayCommand,
    WFHCommand,
<<<<<<< HEAD
    LeaveCommand,
=======
    RemindCommand,
    UserStatusCommand,
    PingCommand,
    UserStatusService,
>>>>>>> develop
    BotService,
    KomubotrestController,
    UtilsService,
    ReportTracker,
    MoveChannelCommand,
    TimeSheetCommand,
    OpenTalkService,
    MeetingSchedulerService,
    ReminderSchedulerService,
    SendMessageSchedulerService,
    MeetingService,
<<<<<<< HEAD
    OrderService,
    UntilService,
    KomubotrestService,
    CompanytripService,
    HolidayService,
<<<<<<< HEAD
    BotService,
    ReportTracker,
    ElsaCommand,
    ElsaService,
    RequestOrder,
    NotificationCommand,
    NotifiService,
=======
    LeaveService
>>>>>>> develop
=======
    ToggleActiveCommand,
    ToggleActiveService,
    NotifiService,
    NotificationCommand,
    OrderCommand,
    PollCommand,
    OrderService,
    ReportCommand,
    ReportOrderService,
    ReportDailyService,
    HolidayService,
    Ncc8Command,
    KomubotrestController,
    CompanytripService,
    PollEmbedUntil,
    ConfigService,
    ClientConfigService,
    MoveChannelService,
    ReportHolidayService,
    ReportOpenTalkService,
    AudioPlayer,
    ReportWomenDayService,
    ReportCheckoutService,
    UserNotDailyService,
>>>>>>> develop
  ],
  controllers: [BotController],
})
export class BotModule {}
