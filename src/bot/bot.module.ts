import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DailyCommand } from "./commands/daily.command";
import { BotGateway } from "./events/bot.gateway";
import { Daily } from "./models/daily.entity";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";

@Module({
  imports: [
    DiscordModule.forFeature(),
    DiscoveryModule,
    TypeOrmModule.forFeature([Daily]),
  ],
  providers: [PlaySlashCommand, PlaylistSlashCommand, BotGateway, DailyCommand],
})
export class BotModule {}
