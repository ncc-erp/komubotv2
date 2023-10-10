import { Module } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChannelController } from "./channel.controller";
import { Channel } from "src/bot/models/channel.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscordModule } from "@discord-nestjs/core";
import { GetNameChannelService } from "src/bot/utils/getFullNameChannel/getFullNameChannel.service";
import { User } from "src/bot/models/user.entity";
import { Client, GatewayIntentBits } from 'discord.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User]), 
    DiscordModule.forFeature(),
  ],
  controllers: [ChannelController],
  providers: [
    ChannelService, 
    GetNameChannelService,
    {
      provide: 'DiscordClient',
      useValue: new Client({
        intents: [
          GatewayIntentBits.Guilds, 
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.GuildVoiceStates,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildIntegrations
        ],
      }),
    },
  ],
})
export class ChannelModule {}
