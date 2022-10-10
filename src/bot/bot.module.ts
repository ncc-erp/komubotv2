import { DiscordModule } from "@discord-nestjs/core";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { MulterModule } from "@nestjs/platform-express";
import { ScheduleModule as NestjsScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompantripCommand } from "./commands/companytrip/companytrip.command";
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
import { BotGateway } from "./guards/events/bot.gateway";
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
import { CheckListModule } from "./utils/checklist/checklist.module";
import { UtilsService } from "./utils/utils.service";

import { CompanytripService } from "./commands/companytrip/companytrip.service";
import NotificationCommand from "./commands/notification/noti.command";

import { OpenTalkService } from "./commands/open-talk/open-talk.service";
import { OrderCommand } from "./commands/order/order.command";
import { OrderService } from "./commands/order/order.service";
import { CompanyTrip } from "./models/companyTrip.entity";
import { Opentalk } from "./models/opentalk.entity";
import { Uploadfile } from "./models/uploadFile.entity";
import { UtilsModule } from "./utils/utils.module";

import { ConfigService } from "@nestjs/config";
import LeaveCommand from "./commands/leave/leave.command";
import { LeaveService } from "./commands/leave/leave.service";
import { PollCommand } from "./commands/poll/poll.command";
import { ClientConfigService } from "./config/client-config.service";
import { CheckList } from "./models/checklist.entity";
import { Subcategorys } from "./models/subcategoryData.entity";
import { CheckListController } from "./utils/checklist/checklist.controller";
import { CheckListService } from "./utils/checklist/checklist.service";
import { PollEmbedUntil } from "./utils/poll/pollEmbed.until";
import { ReportWFHModule } from "./utils/reportWFH/report-wfh.module";

import { BWLCommand } from "./commands/bwl/bwl.command";
import { BWLService } from "./commands/bwl/bwl.service";
import { ChecklistCommand } from "./commands/checklist/checklist.command";
import { ClCommand } from "./commands/cl/cl.command";
import { DailyCommand } from "./commands/daily/daily.command";
import { DailyService } from "./commands/daily/daily.service";
import { GemrankCommand } from "./commands/gemrank/gemrank.command";
import { HeyboyCommand } from "./commands/heyboy/heyboy.command";
import { HeyboyService } from "./commands/heyboy/heyboy.service";
import { KickbotCommand } from "./commands/kickbot/kickbot.command";
import { MvChannelCommand } from "./commands/mvChannel/mvChannel.command";
import { OpenTalkCommand } from "./commands/open-talk/open-talk.command";
import { EvalCommand } from "./commands/owner/eval.command";
import { ReloadCommand } from "./commands/owner/reload.command";
import PenaltyCommand from "./commands/penalty/penalty.command";
import { PenaltyService } from "./commands/penalty/penalty.service";
import { Sync_roleDiscord } from "./commands/sync_rolediscord/sync_rolediscord";
import { Sync_role } from "./commands/sync_roles/sync_role.command";
import { UpdateCommand } from "./commands/update/update.command";
import { AddEmojiCommand } from "./commands/utilities/addemoji.command";
import { AntCommand } from "./commands/utilities/ant.command";
import { BotInfo } from "./commands/utilities/botinfo.command";
import { HasvotedCommand } from "./commands/utilities/hasvoted.command";
import { HelpCommand } from "./commands/utilities/help.command";
import { LinksCommand } from "./commands/utilities/links.command";
import { PingCommand } from "./commands/utilities/ping.command";
import { ServerInfoCommand } from "./commands/utilities/serverinfo.command";
import { UserInfoCommand } from "./commands/utilities/userInfo.command";
import { WolCommand } from "./commands/utilities/wol.command";
import { WomanDayCommand } from "./commands/womanday/womanday.command";
import { WomanDayService } from "./commands/womanday/womanday.service";
import { BirthDay } from "./models/birthday.entity";
import { Bwl } from "./models/bwl.entity";
import { BwlReaction } from "./models/bwlReact.entity";
import { CheckCamera } from "./models/checkCamera.entity";
import { Conversation } from "./models/conversation.entity";
import { Dating } from "./models/dating.entity";
import { GuildData } from "./models/guildData.entity";
import { JoinCall } from "./models/joinCall.entity";
import { Keep } from "./models/keep.entity";
import { Penalty } from "./models/penatly.entity";
import { Quiz } from "./models/quiz.entity";
import { TimeVoiceAlone } from "./models/timeVoiceAlone.entity";
import { TrackerSpentTime } from "./models/trackerSpentTime.entity";
import { TX8 } from "./models/tx8.entity";
import { UserQuiz } from "./models/userQuiz";
import { Wiki } from "./models/wiki.entity";
import { WomenDay } from "./models/womenDay.entity";
import { SendquizSchedulerService } from "./scheduler/sendquiz-scheduler/sendquiz-scheduler.service";
import { UpdateRoleSchedulerService } from "./scheduler/updateRole-scheduler/updateRole-scheduler.service";
import { VoiceChannelSchedulerService } from "./scheduler/voice-channel-scheduler/voice-channel-scheduler.service";
import { KeepSlashCommand } from "./slash-commands/keep.slashcommand";
import { MachleoSlashCommand } from "./slash-commands/machleo.slashcommand";
import { TicketSlashCommand } from "./slash-commands/ticket.slashcommand";
import { VocabSlashCommand } from "./slash-commands/vocab.slashcommand";
import { WikiSlashCommand } from "./slash-commands/wiki.slashcommand";
import { BirthdayService } from "./utils/birthday/birthdayservice";
import { DmMessageUntil } from "./utils/dmmessage/dmmessage.until";
import { ExtendersService } from "./utils/extenders/extenders.service";
import { UserNotDailyService } from "./utils/getUserNotDaily/getUserNotDaily.service";
import { KomubotrestController } from "./utils/komubotrest/komubotrest.controller";
import { KomubotrestService } from "./utils/komubotrest/komubotrest.service";
import { OdinReportService } from "./utils/odinReport/odinReport.service";
import { QuizService } from "./utils/quiz/quiz.service";
import { ReportCheckCameraService } from "./utils/reportCheckCamera/reportCheckCamera.service";
import { ReportCheckoutService } from "./utils/reportCheckout/reportCheckout.service";
import { ReportHolidayService } from "./utils/reportHoliday/reportHoliday.service";
import { ReportOpenTalkService } from "./utils/reportOpentalk/reportOpentalk.service";
import { ReportTrackerService } from "./utils/reportTracker/reportTracker.service";
import { ReportWomenDayService } from "./utils/reportWomenDay/reportWomenDay.service";
import { RequestOrder } from "./utils/requestorder.utils";
import { UpdateRole } from "./utils/roles.utils";
import { BackupCommand } from "./commands/backupdata/backupData";
import { Channel } from "./models/channel.entity";
import Ncc8Command from "./commands/ncc8/ncc8.command";
import { AudioPlayer } from "./utils/audioPlayer.utils";
import { GetApiWfh } from "./utils/getApiWfh.untils";
import { WfhUntil } from "./utils/wfh.until";
import { ReportMsgCountService } from "./utils/reportMsgCount/reportMsgCount.service";
import { SendQuizToSingleUserService } from "./utils/sendQuizToSingleUser/sendQuizToSingleUser.service";

@Module({
  imports: [
    DiscordModule.forFeature(),
    MulterModule.register({
      dest: "./files",
    }),
    DiscoveryModule,
    TypeOrmModule.forFeature([
      BwlReaction,
      Bwl,
      Daily,
      Penalty,
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
      GuildData,
      Quiz,
      Keep,
      Wiki,
    ]),
    CheckListModule,
    NestjsScheduleModule.forRoot(),
    HttpModule,
    UtilsModule,
    ReportWFHModule,
  ],
  providers: [
    CompantripCommand,
    CompanytripService,
    BotGateway,
    LeaveCommand,
    LeaveService,
    MeetingCommand,
    WFHCommand,
    RemindCommand,
    ClCommand,
    UserStatusCommand,
    UserStatusService,
    KomubotrestController,
    UtilsService,
    GetApiWfh,
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
    ReportHolidayService,
    ReportOpenTalkService,
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
    DmMessageUntil,
    VoiceChannelSchedulerService,
    GemrankCommand,
    OpenTalkCommand,
    WomanDayCommand,
    WomanDayService,
    RequestOrder,
    KomubotrestService,
    Uploadfile,
    HeyboyCommand,
    HeyboyService,
    BWLCommand,
    ExtendersService,
    HasvotedCommand,
    PingCommand,
    ChecklistCommand,
    DailyCommand,
    QuizService,
    UserInfoCommand,
    LinksCommand,
    ServerInfoCommand,
    AddEmojiCommand,
    PenaltyCommand,
    PenaltyService,
    BWLCommand,
    BWLService,
    TicketSlashCommand,
    MachleoSlashCommand,
    KeepSlashCommand,
    WikiSlashCommand,
    VocabSlashCommand,
    SendquizSchedulerService,
    SendQuizToSingleUserService,
    BackupCommand,
    Ncc8Command,
    WfhUntil,
    ReportMsgCountService,
  ],
  controllers: [KomubotrestController],
})
export class BotModule {}
