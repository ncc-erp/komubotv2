import { DiscordModule } from "@discord-nestjs/core";
import { forwardRef, Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { ChecklistCommand } from "./commands/checklist.command";
import { CheckListModule } from "./commands/checklist/checklist.module";
import { CompantripCommand } from "./commands/companytrip/companytrip.command";
import { CompanyModule } from "./commands/companytrip/companytrip.module";

import { DailyCommand } from "./commands/daily.command";
import holidayCommand from "./commands/holiday.command";
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
import { BotGateway } from "./events/bot.gateway";
import { Daily } from "./models/daily.entity";
import { Holiday } from "./models/holiday.entity";
import { Leave } from "./models/leave.entity";
import { Meeting } from "./models/meeting.entity";
import { Msg } from "./models/msg.entity";
import { Order } from "./models/order.entity";
import { Remind } from "./models/remind.entity";
import { User } from "./models/user.entity";
import { VoiceChannels } from "./models/voiceChannel.entity";
import { WorkFromHome } from "./models/wfh.entity";
import { MeetingSchedulerService } from "./scheduler/meeting-scheduler/meeting-scheduler.service";
import { ReminderSchedulerService } from "./scheduler/reminder-scheduler/reminder-scheduler.service";
import { SendMessageSchedulerService } from "./scheduler/send-message-scheduler/send-message-scheduler.service";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
import { ReportTracker } from "./untils/report-tracker";
import { UntilService } from "./untils/until.service";
import { KomubotrestController } from "./utils/komubotrest/komubotrest.controller";
import { KomubotrestService } from "./utils/komubotrest/komubotrest.service";

@Module({
  imports: [
    DiscordModule.forFeature(),
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
    ]),
    forwardRef(() => CheckListModule),
    CompanyModule,
    NestjsScheduleModule.forRoot(),
    HttpModule,
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
    ChecklistCommand,
    CompantripCommand,
    BotGateway,
    DailyCommand,
    MeetingCommand,
    HeyboyCommand,
    HeyboyService,
    // ToggleActiveCommand,
    // OrderCommand,
    holidayCommand,
    // LeaveCommand,
    WFHCommand,
    RemindCommand,
    UserStatusCommand,
    UserStatusService,
    BotService,
    UntilService,
    ReportTracker,
    // TestCommand,
    MeetingCommand,
    MeetingSchedulerService,
    ReminderSchedulerService,
    SendMessageSchedulerService,
    MeetingService,
    // ToggleActiveService
    KomubotrestController,
    KomubotrestService
  ],
  controllers: [BotController],
})
export class BotModule {}
