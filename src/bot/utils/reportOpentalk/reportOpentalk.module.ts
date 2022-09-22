import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Holiday } from "src/bot/models/holiday.entity";
import { Opentalk } from "src/bot/models/opentalk.entity";
import { UtilsService } from "../utils.service";
import { ReportOpenTalkService } from "./reportOpentalk.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Opentalk, Holiday]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [ReportOpenTalkService, UtilsService],
})
export class ReportOpenTalkModule {}
