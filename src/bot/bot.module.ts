import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DailyCommand } from "./commands/daily.command";
import holidayCommand from "./commands/holiday.command";
import LeaveCommand from "./commands/leave.command";
import OrderCommand from "./commands/ncc8.command";
import { BotGateway } from "./events/bot.gateway";
import { Daily } from "./models/daily.entity";
import { Holiday } from "./models/holiday.entity";
import { Leave } from "./models/leave.entity";
import { Order } from "./models/order.entity";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";

@Module({
  imports: [
    DiscordModule.forFeature(),
    DiscoveryModule,
    TypeOrmModule.forFeature([Daily]),
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([Leave]),
    TypeOrmModule.forFeature([Holiday]),

  ],
  providers: [PlaySlashCommand, PlaylistSlashCommand, BotGateway, DailyCommand, OrderCommand, holidayCommand, LeaveCommand],
})
export class BotModule {}
