import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
<<<<<<< HEAD
import { ChecklistCommand } from "./commands/checklist.command";
import { CheckListController } from "./commands/checklist/checklist.controller";
import { CheckListModule } from "./commands/checklist/checklist.module";
import { CheckListService } from "./commands/checklist/checklist.service";
import { CompantripCommand } from "./commands/companytrip/companytrip.command";
import { CompanyModule } from "./commands/companytrip/companytrip.module";
=======
import { CompantripCommand } from "./commands/Companytrip/companytrip.command";
import { CompanytripService } from "./commands/Companytrip/companytrip.service";
>>>>>>> 9aadc0606b7c05ae6748aea24a3abbfc40bb50d5

import { DailyCommand } from "./commands/daily.command";
import holidayCommand from "./commands/holiday/holiday.command";
import { HolidayService } from "./commands/holiday/holiday.service";
import LeaveCommand from "./commands/leave.command";
import { OrderCommand } from "./commands/Order/order.command";
import { OrderService } from "./commands/Order/order.service";
import { BotGateway } from "./events/bot.gateway";
import { CompanyTrip } from "./models/companyTrip.entity";
import { Daily } from "./models/daily.entity";
import { Holiday } from "./models/holiday.entity";
import { Leave } from "./models/leave.entity";
import { Order } from "./models/order.entity";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
import { Komubotrest } from "./untils/komubotrest.service";
import { UntilService } from "./untils/until.service";

@Module({
  imports: [
    DiscordModule.forFeature(),
    DiscoveryModule,
    TypeOrmModule.forFeature([Daily, Order, Leave, Holiday,CompanyTrip]),
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
<<<<<<< HEAD
    ChecklistCommand,
=======
    CompantripCommand,
>>>>>>> 9aadc0606b7c05ae6748aea24a3abbfc40bb50d5
    BotGateway,
    DailyCommand,
    holidayCommand,
    LeaveCommand,
    BotService,
<<<<<<< HEAD
    UntilService
=======
    OrderService,
    UntilService,
    Komubotrest,
    CompanytripService,
    HolidayService,
>>>>>>> 9aadc0606b7c05ae6748aea24a3abbfc40bb50d5
  ],
  controllers: [BotController],
})
export class BotModule {}
