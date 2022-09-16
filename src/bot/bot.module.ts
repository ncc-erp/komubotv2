import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { ChecklistCommand } from "./commands/checklist/checklist.command";

import { DailyCommand } from "./commands/daily.command";
import { ElsaCommand } from "./commands/elsa/elsa.command";
import { ElsaService } from "./commands/elsa/elsa.service";
import holidayCommand from "./commands/holiday/holiday.command";
import { HolidayService } from "./commands/holiday/holiday.service";
import LeaveCommand from "./commands/leave.command";
import { MeetingCommand } from "./commands/meeting/meeting.command";
import { MeetingService } from "./commands/meeting/meeting.service";
import { OrderCommand } from "./commands/Order/order.command";
import { OrderService } from "./commands/Order/order.service";
import { BotGateway } from "./events/bot.gateway";

import { Daily } from "./models/daily.entity";
import { ElsaDaily } from "./models/elsaDaily.entity";
import { Holiday } from "./models/holiday.entity";
import { Leave } from "./models/leave.entity";
import { Meeting } from "./models/meeting.entity";
import { Order } from "./models/order.entity";
import { VoiceChannels } from "./models/voiceChannel.entity";
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

@Module({
  imports: [
    DiscordModule.forFeature(),
    DiscoveryModule,
    CompanyModule,
    TypeOrmModule.forFeature([
      ElsaDaily,
      CheckList,
      Subcategorys,
      User,
      Daily,
      Order,
      Leave,
      Holiday,
      CompanyTrip,
      Meeting,
      VoiceChannels,
      Message,
      WorkFromHome,
      ReportTracker,
    ]),
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
    BotGateway,
    ChecklistCommand,
    CheckListController,
    CheckListService,
    DailyCommand,
    GemrankCommand,
    holidayCommand,
    LeaveCommand,
    OrderCommand,
    MeetingCommand,
    holidayCommand,
    WFHCommand,
    LeaveCommand,
    BotService,
    MeetingService,
    OrderService,
    UntilService,
    KomubotrestService,
    CompanytripService,
    HolidayService,
    BotService,
    ReportTracker,
    ElsaCommand,
    ElsaService,
    RequestOrder,
    NotificationCommand,
    NotifiService,
  ],
  controllers: [BotController],
})
export class BotModule {}
