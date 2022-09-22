import { DiscordModule } from "@discord-nestjs/core";
import { forwardRef, Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { ChecklistCommand } from "./commands/checklist.command";
// import { CheckListModule } from "./commands/checklist/checklist.module";
import { CompantripCommand } from "./commands/companytrip/companytrip.command";
import { CompanyModule } from "./commands/companytrip/companytrip.module";

import { DailyCommand } from "./commands/daily.command";
import { MeetingCommand } from "./commands/meeting/meeting.command";
import { MeetingService } from "./commands/meeting/meeting.service";
import { RemindCommand } from "./commands/remind/remind.command";
import { UserStatusCommand } from "./commands/user_status/user_status.command";
import { UserStatusService } from "./commands/user_status/user_status.service";
import { WFHCommand } from "./commands/wfh/wfh.command";
// import { TestCommand } from "./commands/test";
// import LeaveCommand from "./commands/leave.command";
// import OrderCommand from "./commands/order.command";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule as NestjsScheduleModule } from "@nestjs/schedule";
import { HeyboyCommand } from "./commands/heyboy/heyboy.command";
import { HeyboyService } from "./commands/heyboy/heyboy.service";
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
import { WorkFromHome } from "./models/wfh.entity";
import { MeetingSchedulerService } from "./scheduler/meeting-scheduler/meeting-scheduler.service";
import { ReminderSchedulerService } from "./scheduler/reminder-scheduler/reminder-scheduler.service";
import { SendMessageSchedulerService } from "./scheduler/send-message-scheduler/send-message-scheduler.service";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
import { NotifiService } from "./commands/notification/noti.service";
import { ToggleActiveCommand } from "./commands/toggleActive/toggleActive.command";
import { ToggleActiveService } from "./commands/toggleActive/toggleActive.service";
import NotificationCommand from "./commands/notification/noti.command";
import { MulterModule } from "@nestjs/platform-express";
import { Uploadfile } from "./models/uploadFile.entity";
import { ReportOrderModule } from "./utils/reportOrder/reportOrder.module";
import { ReportCommand } from "./commands/report/report.command";
import { ReportOrderService } from "./utils/reportOrder/reportOrder.service";
import { UtilsService } from "./utils/utils.service";
import { ReportTracker } from "./utils/report-tracker";
// import { ReportOrder } from "./utils/reportOrder.utils";
import HolidayCommand from "./commands/holiday/holiday.command";
import { Order } from "./models/order.entity";
import { HolidayService } from "./commands/holiday/holiday.service";
import { OrderCommand } from "./commands/order/order.command";
import { OrderService } from "./commands/order/order.service";
import Ncc8Command from "./commands/ncc8/ncc8.command";
import { AudioPlayer } from "./utils/audioPlayer.utils";
// import { CheckListController } from "./commands/Checklist/checklist.controller";

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
    ]),
    // forwardRef(() => CheckListModule),
    CompanyModule,
    NestjsScheduleModule.forRoot(),
    HttpModule,
    ReportOrderModule,
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
    ChecklistCommand,
    CompantripCommand,
    BotGateway,
    DailyCommand,
    MeetingCommand,
    HolidayCommand,
    // LeaveCommand,
    WFHCommand,
    RemindCommand,
    UserStatusCommand,
    UserStatusService,
    BotService,
    UtilsService,
    ReportTracker,
    // TestCommand,
    TimeSheetCommand,
    MeetingSchedulerService,
    ReminderSchedulerService,
    SendMessageSchedulerService,
    MeetingService,
    ToggleActiveCommand,
    ToggleActiveService,
    NotifiService,
    NotificationCommand,
    OrderCommand,
    OrderService,
    ReportCommand,
    ReportOrderService,
    HolidayService,
    Ncc8Command,
    AudioPlayer,
  ],
  controllers: [BotController],
})
export class BotModule {}
