import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Holiday } from "src/bot/models/holiday.entity";
import { Order } from "src/bot/models/order.entity";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { UtilsService } from "../utils.service";
import { ExtendersService } from "./extenders.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Holiday]),
    DiscordModule.forFeature(),
    DiscoveryModule,
  ],
  providers: [ExtendersService, UtilsService, KomubotrestService],
})
export class ExtendersModule {}
