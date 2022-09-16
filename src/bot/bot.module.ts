import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { CompantripCommand } from "./commands/Companytrip/companytrip.command";
import { CompanytripService } from "./commands/Companytrip/companytrip.service";

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
    CompantripCommand,
    BotGateway,
    DailyCommand,
    OrderCommand,
    holidayCommand,
    LeaveCommand,
    BotService,
    OrderService,
    UntilService,
    Komubotrest,
    CompanytripService,
    HolidayService,
  ],
  controllers: [BotController],
})
export class BotModule {}
