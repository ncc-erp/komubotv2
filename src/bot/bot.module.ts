import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DailyCommand } from "./commands/daily.command";
import { BotGateway } from "./events/bot.gateway";
import { Daily } from "./models/daily.entity";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
import { UntilService } from "./untils/until.service";
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  imports: [
    DiscordModule.forFeature(),
    DiscoveryModule,
    TypeOrmModule.forFeature([Daily]),
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
    BotGateway,
    DailyCommand,
    UntilService,
    BotService,
  ],
  controllers: [BotController],
})
export class BotModule {}
