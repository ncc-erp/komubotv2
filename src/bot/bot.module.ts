import { Channel, DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { ChecklistCommand } from "./commands/checklist.command";
import { CompantripCommand } from "./commands/companytrip/companytrip.command";

import { HttpModule } from "@nestjs/axios";
import { MulterModule } from "@nestjs/platform-express";
import { ScheduleModule as NestjsScheduleModule } from "@nestjs/schedule";
import { DailyCommand } from "./commands/daily.command";
import holidayCommand from "./commands/holiday.command";
import { MeetingCommand } from "./commands/meeting/meeting.command";
import { MeetingService } from "./commands/meeting/meeting.service";
import { NotifiService } from "./commands/notification/noti.service";
import { RemindCommand } from "./commands/remind/remind.command";
import { TimeSheetCommand } from "./commands/timesheet/timesheet.command";
import { ToggleActiveCommand } from "./commands/toggleActive/toggleActive.command";
import { ToggleActiveService } from "./commands/toggleActive/toggleActive.service";
import { UserStatusCommand } from "./commands/user_status/user_status.command";
import { UserStatusService } from "./commands/user_status/user_status.service";
import { WFHCommand } from "./commands/wfh/wfh.command";
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
import { CheckListModule } from "./utils/checklist/checklist.module";
import { ReportTracker } from "./utils/report-tracker.untils";
import { UtilsService } from "./utils/utils.service";




import { AddEmojiCommand } from "./commands/addemoji.command";
import { CompanytripService } from "./commands/companytrip/companytrip.service";
import { GemrankCommand } from "./commands/gemrank.command";
import { HasvotedCommand } from "./commands/hasvoted.command";
import NotificationCommand from "./commands/notification/noti.command";


import { OpenTalkService } from "./commands/open-talk/open-talk.service";
import { OrderCommand } from "./commands/order/order.command";
import { OrderService } from "./commands/order/order.service";
import { PingCommand } from "./commands/ping/ping";
import { ServerInfoCommand } from "./commands/serverinfo.command";
import { CompanyTrip } from "./models/companyTrip.entity";
import { Opentalk } from "./models/opentalk.entity";
import { Uploadfile } from "./models/uploadFile.entity";
import { KomubotrestController } from "./utils/komubotrest/komubotrest.controller";
import { UtilsModule } from "./utils/utils.module";


import { AudioPlayer } from "@discordjs/voice";
import { ConfigService } from "@nestjs/config";
import LeaveCommand from "./commands/leave/leave.command";
import { LeaveService } from "./commands/leave/leave.service";
import { MoveChannelService } from "./commands/move_channel/move_channel.service";
import { PollCommand } from "./commands/poll/poll.command";
import { ClientConfigService } from "./config/client-config.service";
import { CheckListController } from "./utils/checklist/checklist.controller";
import { CheckListService } from "./utils/checklist/checklist.service";
import { PollEmbedUntil } from "./utils/poll/pollEmbed.until";
import { ReportWFHModule } from "./utils/reportWFH/report-wfh.module";
import { CheckList } from "./models/checklistdata.entity";
import { Subcategorys } from "./models/subcategoryData.entity";
import { MoveChannelCommand } from "./commands/move_channel/move_channel.command";



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
    holidayCommand,
    
    AddEmojiCommand,
    HasvotedCommand,
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
    ServerInfoCommand,
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
    CheckListController,
    KomubotrestController,
    CompanytripService,
    AudioPlayer,
    CheckListService,
    PollEmbedUntil,
    ConfigService,
    ClientConfigService,
    MoveChannelService,
  ],
  controllers: [BotController],
})
export class BotModule {}