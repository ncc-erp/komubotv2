import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Msg } from "src/bot/models/msg.entity";
import { DiscordModule } from "@discord-nestjs/core";
import { User } from "src/bot/models/user.entity";
import { GetNameChannelService } from "src/bot/utils/getFullNameChannel/getFullNameChannel.service";

@Module({
  imports: [TypeOrmModule.forFeature([Msg, User]), DiscordModule.forFeature()],
  controllers: [MessageController],
  providers: [MessageService, GetNameChannelService],
})
export class MessageModule {}
