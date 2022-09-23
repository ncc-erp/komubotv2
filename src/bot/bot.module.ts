import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { ChecklistCommand } from "./commands/checklist.command";
// import { CheckListModule } from "./commands/checklist/checklist.module";
import { CompantripCommand } from "./commands/companytrip/companytrip.command";

import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { ScheduleModule as NestjsScheduleModule } from "@nestjs/schedule";
import { DailyCommand } from "./commands/daily.command";
import { GemrankCommand } from "./commands/gemrank.command";
import LeaveCommand from "./commands/leave/leave.command";
import { LeaveService } from "./commands/leave/leave.service";
import { MeetingCommand } from "./commands/meeting/meeting.command";
import { MeetingService } from "./commands/meeting/meeting.service";
import { MoveChannelCommand } from "./commands/move_channel/move_channel.command";
import { NotifiService } from "./commands/notification/noti.service";
import { OpenTalkService } from "./commands/open-talk/open-talk.service";
import { OrderCommand } from "./commands/order/order.command";
import { PollCommand } from "./commands/poll/poll.command";
import { RemindCommand } from "./commands/remind/remind.command";
import { ReportCommand } from "./commands/report/report.command";
import { TimeSheetCommand } from "./commands/timesheet/timesheet.command";
import { ToggleActiveCommand } from "./commands/toggleActive/toggleActive.command";
import { ToggleActiveService } from "./commands/toggleActive/toggleActive.service";
import { UserStatusCommand } from "./commands/user_status/user_status.command";
import { UserStatusService } from "./commands/user_status/user_status.service";
import { WFHCommand } from "./commands/wfh/wfh.command";
import { ClientConfigService } from "./config/client-config.service";
import { BotGateway } from "./events/bot.gateway";
import { Daily } from "./models/daily.entity";
import { Holiday } from "./models/holiday.entity";
import { Leave } from "./models/leave.entity";
import { Meeting } from "./models/meeting.entity";
import { Msg } from "./models/msg.entity";
import { Opentalk } from "./models/opentalk.entity";
import { Remind } from "./models/remind.entity";
import { Uploadfile } from "./models/uploadFile.entity";
import { User } from "./models/user.entity";
import { VoiceChannels } from "./models/voiceChannel.entity";
import { WorkFromHome } from "./models/wfh.entity";
import { MeetingSchedulerService } from "./scheduler/meeting-scheduler/meeting-scheduler.service";
import { ReminderSchedulerService } from "./scheduler/reminder-scheduler/reminder-scheduler.service";
import { SendMessageSchedulerService } from "./scheduler/send-message-scheduler/send-message-scheduler.service";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
import { CheckListModule } from "./utils/checklist/checklist.module";
import { PollEmbedUntil } from "./utils/poll/pollEmbed.until";
import { ReportOrderService } from "./utils/reportOrder/reportOrder.service";
import { ReportWFHModule } from "./utils/reportWFH/report-wfh.module";
import { UtilsModule } from "./utils/utils.module";
import { UtilsService } from "./utils/utils.service";

// import { ReportOrder } from "./utils/reportOrder.utils";
import HolidayCommand from "./commands/holiday/holiday.command";
import { HolidayService } from "./commands/holiday/holiday.service";
import Ncc8Command from "./commands/ncc8/ncc8.command";
import { Order } from "./models/order.entity";
// import { CheckListController } from "./commands/Checklist/checklist.controller";
import { CompanytripService } from "./commands/companytrip/companytrip.service";
import { MoveChannelService } from "./commands/move_channel/move_channel.service";
import NotificationCommand from "./commands/notification/noti.command";
import { PingCommand } from "./commands/ping/ping";
import { Channel } from "./models/channel.entity";
import { CheckList } from "./models/checklistdata.entity";
import { CompanyTrip } from "./models/companyTrip.entity";
import { Subcategorys } from "./models/subcategoryData.entity";
import { AudioPlayer } from "./utils/audioPlayer.utils";
import { KomubotrestController } from "./utils/komubotrest/komubotrest.controller";
import { ReportTracker } from "./utils/report-tracker.untils";
import { ReportHolidayService } from "./utils/reportHoliday/reportHoliday.service";
import { ReportOpenTalkService } from "./utils/reportOpentalk/reportOpentalk.service";
import { OrderService } from "./commands/order/order.service";

@Module({
  imports: [
    DiscordModule.forFeature(),
    MulterModule.register({
      dest: "./files",
    }),
    DiscoveryModule,
    TypeOrmModule.forFeature([
      Daily,
      Order,
      Leave,
      Holiday,
      User,
      Meeting,
      VoiceChannels,
      WorkFromHome,
      Msg,
      Remind,
      Uploadfile,
      Opentalk,
      CompanyTrip,
      CheckList,
      Subcategorys,
      Channel,
    ]),
    // forwardRef(() => CheckListModule),
    CheckListModule,
    NestjsScheduleModule.forRoot(),
    HttpModule,
    UtilsModule,
    ReportWFHModule,
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
    HolidayCommand,
    // LeaveCommand,
    GemrankCommand,
    WFHCommand,
    RemindCommand,
    UserStatusCommand,
    PingCommand,
    UserStatusService,
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
    ToggleActiveCommand,
    ToggleActiveService,
    NotifiService,
    NotificationCommand,
    OrderCommand,
    PollCommand,
    OrderService,
    ReportCommand,
    ReportOrderService,
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
    AudioPlayer
  ],
  controllers: [BotController],
})
export class BotModule {}
