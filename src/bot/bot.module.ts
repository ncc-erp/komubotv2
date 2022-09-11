import { DiscordModule } from "@discord-nestjs/core";
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

@Module({
  imports: [
    DiscordModule.forFeature(),
    TypeOrmModule.forFeature([Daily]),
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([Leave]),
    TypeOrmModule.forFeature([Meeting]),
    TypeOrmModule.forFeature([Channel]),
  ],
  providers: [PlayCommand, PlaylistCommand, BotGateway],
})
export class BotModule {}
