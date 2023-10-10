import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/bot/models/user.entity";
import { GetNameChannelService } from "./getFullNameChannel.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), DiscordModule.forFeature()],
  providers: [GetNameChannelService],
})
export class getApiWfhModule {}
