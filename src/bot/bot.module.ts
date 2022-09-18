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
import { OrderCommand } from "./commands/order/order.command";
import { OrderService } from "./commands/order/order.service";
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
import { HeyboyCommand } from "./commands/heyboy/heyboy.command";
import { KomubotrestController } from "./untils/komubotrest/komubotrest.controller";
import { HeyboyService } from "./commands/heyboy/heyboy.service";
import { UntilService } from "./untils/until.service";
import { KomubotrestModule } from "./untils/komubotrest/kombotrest.module";
import { User } from "./models/user.entity";


@Module({
  imports: [
    DiscordModule.forFeature(),
    DiscoveryModule,
    TypeOrmModule.forFeature([Daily, Order, Leave, Holiday, ElsaDaily, CheckList, Subcategorys, User,       Meeting,
      VoiceChannels]), 
    CompanyModule,
    KomubotrestModule
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
    BotGateway,
    ChecklistCommand,
    CheckListController,
    CheckListService,
    HeyboyCommand,
    DailyCommand,
    GemrankCommand,
    holidayCommand,
    LeaveCommand,
    OrderCommand,
    holidayCommand,
    LeaveCommand,
    BotService,
    OrderService,
    HolidayService,
    BotService,
    ElsaCommand,
    ElsaService,
    RequestOrder, 
    HeyboyService,
    UntilService
  ],
  controllers: [BotController],
})
export class BotModule {}
