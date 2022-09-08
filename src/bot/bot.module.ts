import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import DailyCommand from "./commands/daily.command";
import { BotGateway } from "./events/bot.gateway";
import { Daily } from "./models/daily.entity";
import { Order } from "./models/order.entity";
import { PlayCommand } from "./slash-commands/play.slashcommand";
import { PlaylistCommand } from "./slash-commands/playlist.slashcommand";

@Module({
  imports: [
    DiscordModule.forFeature(),
    TypeOrmModule.forFeature([Daily]),
    TypeOrmModule.forFeature([Order]),
  ],
  providers: [PlayCommand, PlaylistCommand, BotGateway],
})
export class BotModule {}
