import { DiscordModule } from "@discord-nestjs/core";
import * as Joi from "@hapi/joi";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GatewayIntentBits, Partials } from "discord.js";

import { BotModule } from "./bot/bot.module";
// import { CheckListModule } from "./bot/commands/checklist/checklist.module";
// import { CheckListModule } from "./bot/commands/Checklist/checklist.module";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        //POSTGRES_HOST: Joi.string().required(),
        //POSTGRES_PORT: Joi.number().required(),
        //POSTGRES_USER: Joi.string().required(),
        //POSTGRES_PASSWORD: Joi.string().required(),
        //POSTGRES_DB: Joi.string().required(),
        TOKEN: Joi.string().required(),
        GUILD_ID_WITH_COMMANDS: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("POSTGRES_HOST"),
        port: configService.get("POSTGRES_PORT"),
        username: configService.get("POSTGRES_USER"),
        password: configService.get("POSTGRES_PASSWORD"),
        database: configService.get("POSTGRES_DB"),
        //entities: [__dirname + '/../**/*.entity.ts'],
        autoLoadEntities: true,
        synchronize: true,
       // logging : true,
      }),
    }),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get("TOKEN"),
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildVoiceStates,
          ],
          partials: [
            Partials.Channel,
            Partials.User,
            Partials.Reaction,
            Partials.Message,
          ],
        },
        registerCommandOptions: [
          {
            forGuild: configService.get("GUILD_ID_WITH_COMMANDS"),
            removeCommandsBefore: true,
          },
        ],
        failOnLogin: true,
      }),
      inject: [ConfigService],
    }),
    BotModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "upload", "ncc8"),
    }),
  ],
})
export class AppModule {}
