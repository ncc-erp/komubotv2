import { Module } from "@nestjs/common";
import { MentionService } from "./mention.service";
import { MentionController } from "./mention.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Mentioned } from "src/bot/models/mentioned.entity";
import { Client, GatewayIntentBits } from 'discord.js';

@Module({
  imports: [TypeOrmModule.forFeature([Mentioned])],
  controllers: [MentionController],
  providers: [
    MentionService, 
    {
      provide: 'DiscordClient',
      useValue: new Client({
        intents: [
          GatewayIntentBits.Guilds, 
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.DirectMessages,
        ],
      }),
    },
  ],
})
export class MentionModule {}