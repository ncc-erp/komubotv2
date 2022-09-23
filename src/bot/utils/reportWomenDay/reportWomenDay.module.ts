import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Holiday } from "src/bot/models/holiday.entity";
import { Opentalk } from "src/bot/models/opentalk.entity";
import { WomenDay } from "src/bot/models/womenDay.entity";
import { UtilsService } from "../utils.service";
import { ReportWomenDayService } from "./reportWomenDay.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Holiday, WomenDay]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [ReportWomenDayService, UtilsService],
})
export class ReportWomenDayModule {}
