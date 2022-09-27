import { Channel, DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { CompantripCommand } from "./commands/companytrip/companytrip.command";

import { HttpModule } from "@nestjs/axios";
import { MulterModule } from "@nestjs/platform-express";
import { ScheduleModule as NestjsScheduleModule } from "@nestjs/schedule";
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

import { CompanytripService } from "./commands/companytrip/companytrip.service";
import NotificationCommand from "./commands/notification/noti.command";

import { OpenTalkService } from "./commands/open-talk/open-talk.service";
import { OrderCommand } from "./commands/order/order.command";
import { OrderService } from "./commands/order/order.service";
import { PingCommand } from "./commands/ping/ping";
import { CompanyTrip } from "./models/companyTrip.entity";
import { Opentalk } from "./models/opentalk.entity";
import { Uploadfile } from "./models/uploadFile.entity";
import { KomubotrestController } from "./utils/komubotrest/komubotrest.controller";
import { UtilsModule } from "./utils/utils.module";

import { AudioPlayer } from "@discordjs/voice";
import { ConfigService } from "@nestjs/config";
import LeaveCommand from "./commands/leave/leave.command";
import { LeaveService } from "./commands/leave/leave.service";
import { MoveChannelCommand } from "./commands/move_channel/move_channel.command";
import { MoveChannelService } from "./commands/move_channel/move_channel.service";
import { PollCommand } from "./commands/poll/poll.command";
import { ClientConfigService } from "./config/client-config.service";
import { CheckList } from "./models/checklist.entity";
import { Subcategorys } from "./models/subcategoryData.entity";
import { CheckListController } from "./utils/checklist/checklist.controller";
import { CheckListService } from "./utils/checklist/checklist.service";
import { PollEmbedUntil } from "./utils/poll/pollEmbed.until";
import { ReportWFHModule } from "./utils/reportWFH/report-wfh.module";

import { DailyService } from "./commands/daily/daily.service";
import { ElsaCommand } from "./commands/elsa/elsa.command";
import { ElsaService } from "./commands/elsa/elsa.service";
import { HeyboyCommand } from "./commands/heyboy/heyboy.command";
import { HeyboyService } from "./commands/heyboy/heyboy.service";
import { KickbotCommand } from "./commands/kickbot/kickbot.command";
import { MvChannelCommand } from "./commands/mvChannel/mvChannel.command";
import { OpenTalkCommand } from "./commands/open-talk/open-talk.command";
import { EvalCommand } from "./commands/owner/eval.command";
import { ReloadCommand } from "./commands/owner/reload.command";
import { Sync_roleDiscord } from "./commands/sync_rolediscord/sync_rolediscord";
import { Sync_role } from "./commands/sync_roles/sync_role.command";
import { UpdateCommand } from "./commands/update/update.command";
import { AntCommand } from "./commands/utilities/ant.command";
import { BotInfo } from "./commands/utilities/botinfo.command";
import { HelpCommand } from "./commands/utilities/help.command";
import { TiktokCommand } from "./commands/utilities/tiktok.command";
import { WolCommand } from "./commands/utilities/wol.command";
import { WomanDayService } from "./commands/womanday/womanday.service";
import { BirthDay } from "./models/birthday.entity";
import { CheckCamera } from "./models/checkCamera.entity";
import { Conversation } from "./models/conversation.entity";
import { Dating } from "./models/dating.entity";
import { ElsaDaily } from "./models/elsaDaily.entity";
import { JoinCall } from "./models/joinCall.entity";
import { TimeVoiceAlone } from "./models/timeVoiceAlone.entity";
import { TrackerSpentTime } from "./models/trackerSpentTime.entity";
import { TX8 } from "./models/tx8.entity";
import { UserQuiz } from "./models/userQuiz";
import { WomenDay } from "./models/womenDay.entity";
import { UpdateRoleSchedulerService } from "./scheduler/updateRole-scheduler/updateRole-scheduler.service";
import { VoiceChannelSchedulerService } from "./scheduler/voice-channel-scheduler/voice-channel-scheduler.service";
import { BirthdayService } from "./utils/birthday/birthdayservice";
import { DmMessageUntil } from "./utils/dmmessage/dmmessage.until";
import { UserNotDailyService } from "./utils/getUserNotDaily/getUserNotDaily.service";
import { KomubotrestService } from "./utils/komubotrest/komubotrest.service";
import { OdinReportService } from "./utils/odinReport/odinReport.service";
import { ReportCheckCameraService } from "./utils/reportCheckCamera/reportCheckCamera.service";
import { ReportCheckoutService } from "./utils/reportCheckout/reportCheckout.service";
import { ReportHolidayService } from "./utils/reportHoliday/reportHoliday.service";
import { ReportOpenTalkService } from "./utils/reportOpentalk/reportOpentalk.service";
import { ReportTrackerService } from "./utils/reportTracker/reportTracker.service";
import { ReportWomenDayService } from "./utils/reportWomenDay/reportWomenDay.service";
import { RequestOrder } from "./utils/requestorder.utils";
import { UpdateRole } from "./utils/roles.utils";
import { GemrankCommand } from "./commands/gemrank/gemrank.command";
import { WomanDayCommand } from "./commands/womanday/womanday.command";
import { CheckListCommand } from "./commands/checklist/checklist.module";

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
      Daily,
      TX8,
      WomenDay,
      BirthDay,
      UserQuiz,
      Dating,
      JoinCall,
      CheckCamera,
      TrackerSpentTime,
      Conversation,
      TimeVoiceAlone,
      ElsaDaily,
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
    CompantripCommand,
    CompanytripService,
    BotGateway,
    LeaveCommand,
    LeaveService,
    MeetingCommand,
    CheckListCommand,
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
    CheckListController,
    KomubotrestController,
    CompanytripService,
    AudioPlayer,
    CheckListService,
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
    BirthdayService,
    UpdateCommand,
    MvChannelCommand,
    Sync_role,
    Sync_roleDiscord,
    UpdateRole,
    DailyService,
    ReportCheckCameraService,
    OdinReportService,
    KickbotCommand,
    AntCommand,
    WolCommand,
    ReportTrackerService,
    UpdateRoleSchedulerService,
    ReloadCommand,
    EvalCommand,
    BotInfo,
    HelpCommand,
    TiktokCommand,
    PingCommand,
    DmMessageUntil,
    VoiceChannelSchedulerService,
    GemrankCommand,
    OpenTalkCommand,
    ElsaCommand,
    ElsaService,
    WomanDayCommand,
    WomanDayService,
    RequestOrder,
    KomubotrestService,
    Uploadfile,
    HeyboyCommand,
    HeyboyService,
  ],
  controllers: [BotController],
})
export class BotModule {}
