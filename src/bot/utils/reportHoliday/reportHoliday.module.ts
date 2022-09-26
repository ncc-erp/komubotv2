import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Holiday } from "src/bot/models/holiday.entity";
import { Msg } from "src/bot/models/msg.entity";
import { Order } from "src/bot/models/order.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { UtilsService } from "../utils.service";
import { ReportHolidayService } from "./reportHoliday.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Holiday, User, Msg, WorkFromHome]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [ReportHolidayService, UtilsService, KomubotrestService],
})
export class ReportHolidayModule {}
