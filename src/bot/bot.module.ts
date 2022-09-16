import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { ChecklistCommand } from "./commands/checklist/checklist.command";
import { Message , Client} from "discord.js";


import { DailyCommand } from "./commands/daily.command";
import { ElsaCommand } from "./commands/elsa/elsa.command";
import { ElsaService } from "./commands/elsa/elsa.service";
import holidayCommand from "./commands/holiday/holiday.command";
import { HolidayService } from "./commands/holiday/holiday.service";
import LeaveCommand from "./commands/leave.command";
<<<<<<< HEAD
import { OrderCommand } from "./commands/order/order.command";
import { OrderService } from "./commands/order/order.service";
=======
import { MeetingCommand } from "./commands/meeting/meeting.command";
import { MeetingService } from "./commands/meeting/meeting.service";
import { OrderCommand } from "./commands/Order/order.command";
import { OrderService } from "./commands/Order/order.service";
>>>>>>> c760a3f6a3adfb7efb3fde47a59cdf715d28b63c
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


@Module({
  imports: [
    DiscordModule.forFeature(),
    DiscoveryModule,
<<<<<<< HEAD
    TypeOrmModule.forFeature([Daily, Order, Leave, Holiday, ElsaDaily, CheckList, Subcategorys]), 
    CompanyModule,
=======
    TypeOrmModule.forFeature([
      Daily,
      Order,
      Leave,
      Holiday,
      CompanyTrip,
      Meeting,
      VoiceChannels,
    ]),
>>>>>>> c760a3f6a3adfb7efb3fde47a59cdf715d28b63c
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
    BotGateway,
    ChecklistCommand,
    CheckListController,
    CheckListService,
    DailyCommand,
<<<<<<< HEAD
    GemrankCommand,
    holidayCommand,
    LeaveCommand,
=======
    OrderCommand,
    MeetingCommand,
    holidayCommand,
    LeaveCommand,
    BotService,
    MeetingService,
    OrderService,
    UntilService,
    Komubotrest,
    CompanytripService,
>>>>>>> c760a3f6a3adfb7efb3fde47a59cdf715d28b63c
    HolidayService,
    BotService,
    ElsaCommand,
    ElsaService,
    RequestOrder
  ],
  controllers: [BotController],
})
export class BotModule {}
