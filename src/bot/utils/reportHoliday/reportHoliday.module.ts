import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Holiday } from "src/bot/models/holiday.entity";
import { Order } from "src/bot/models/order.entity";
import { ReportHolidayService } from "./reportHoliday.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Holiday]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [ReportHolidayService],
})
export class ReportHolidayModule {}
