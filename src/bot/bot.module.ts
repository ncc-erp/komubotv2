import { DiscordModule } from "@discord-nestjs/core";
<<<<<<< HEAD
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import DailyCommand from "./commands/daily.command";
import { BotGateway } from "./events/bot.gateway";
import { Daily } from "./models/daily.entity";
import { Order } from "./models/order.entity";
import { Leave } from "./models/leave.enity";
import { Channel } from "./models/channel.entity";
import { Meeting } from "./models/meeting.entity";
import { PlayCommand } from "./slash-commands/play.slashcommand";
import { PlaylistCommand } from "./slash-commands/playlist.slashcommand";
=======
import { forwardRef, Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { ChecklistCommand } from "./commands/checklist.command";
import { CheckListController } from "./commands/Checklist/checklist.controller";
import { CheckListModule } from "./commands/Checklist/checklist.module";
import { CheckListService } from "./commands/Checklist/checklist.service";
import { CompantripCommand } from "./commands/Companytrip/companytrip.command";
import { CompanyModule } from "./commands/Companytrip/companytrip.module";

import { DailyCommand } from "./commands/daily.command";
import holidayCommand from "./commands/holiday.command";
import LeaveCommand from "./commands/leave.command";
import OrderCommand from "./commands/order.command";
import { BotGateway } from "./events/bot.gateway";
import { Daily } from "./models/daily.entity";
import { Holiday } from "./models/holiday.entity";
import { Leave } from "./models/leave.entity";
import { Order } from "./models/order.entity";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
import { UntilService } from "./untils/until.service";

>>>>>>> task/entity

@Module({
  imports: [
    DiscordModule.forFeature(),
<<<<<<< HEAD
    TypeOrmModule.forFeature([Daily]),
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([Leave]),
    TypeOrmModule.forFeature([Meeting]),
    TypeOrmModule.forFeature([Channel]),
  ],
  providers: [PlayCommand, PlaylistCommand, BotGateway],
=======
    DiscoveryModule,
    TypeOrmModule.forFeature([Daily, Order, Leave, Holiday]),
    forwardRef(() => CheckListModule),
    CompanyModule
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
    ChecklistCommand,
    CompantripCommand,
    BotGateway,
    DailyCommand,
    OrderCommand,
    holidayCommand,
    LeaveCommand,
    BotService, 
    UntilService
  ],
  controllers: [BotController],
>>>>>>> task/entity
})
export class BotModule {}
