import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Channel } from "src/bot/models/channel.entity";
import { Conversation } from "src/bot/models/conversation.entity";
import { Holiday } from "src/bot/models/holiday.entity";
import { Msg } from "src/bot/models/msg.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { UtilsService } from "../utils.service";
import { DmmessageService } from "./dmmessage.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [DmmessageService, UtilsService, KomubotrestService],
  exports: [DmmessageService],
})
export class DmmessageModule {}
