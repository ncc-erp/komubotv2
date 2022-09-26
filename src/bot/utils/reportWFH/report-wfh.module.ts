import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Holiday } from "src/bot/models/holiday.entity";
import { Msg } from "src/bot/models/msg.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { UtilsService } from "../utils.service";
import { ReportWFHService } from "./report-wfh.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkFromHome, Holiday, User, Msg]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [ReportWFHService, UtilsService, KomubotrestService],
  exports: [ReportWFHService, UtilsService],
})
export class ReportWFHModule {}
