import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/bot/models/user.entity";
import { Client, GatewayIntentBits } from 'discord.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService, 
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
export class UserModule {}
