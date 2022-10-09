import { DiscordModule } from "@discord-nestjs/core";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { Holiday } from "src/bot/models/holiday.entity";
import { UtilsService } from "../utils.service";
import { ReportMsgCountService } from "./reportMsgCount.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Holiday]),
    DiscordModule.forFeature(),
    DiscoveryModule,
    HttpModule,
  ],
  providers: [
    ReportMsgCountService,
    UtilsService,
    ClientConfigService,
    ConfigService,
  ],
})
export class ReportMsgCountModule {}
