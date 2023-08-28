import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Channel } from "src/bot/models/channel.entity";
import { Daily } from "src/bot/models/daily.entity";
import { Holiday } from "src/bot/models/holiday.entity";
import { Msg } from "src/bot/models/msg.entity";
import { Order } from "src/bot/models/order.entity";
import { Uploadfile } from "src/bot/models/uploadFile.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { UtilsService } from "../utils.service";
import { ReportHolidayService } from "./reportHoliday.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Holiday,
      User,
      Msg,
      WorkFromHome,
      Channel,
      Daily,
      Uploadfile,
    ]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [
    ReportHolidayService,
    UtilsService,
    KomubotrestService,
  ],
})
export class ReportHolidayModule {}
