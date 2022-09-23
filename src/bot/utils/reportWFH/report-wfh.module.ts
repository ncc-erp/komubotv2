import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Holiday } from "src/bot/models/holiday.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { UtilsService } from "../utils.service";
import { ReportWFHService } from "./report-wfh.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkFromHome, Holiday]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [ReportWFHService, UtilsService],
  exports: [ReportWFHService, UtilsService],
})
export class ReportWFHModule {}
