import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { CompantripCommand } from "./commands/Companytrip/companytrip.command";
import { CompanytripService } from "./commands/Companytrip/companytrip.service";

import { DailyCommand } from "./commands/daily.command";
import holidayCommand from "./commands/holiday/holiday.command";
import { HolidayService } from "./commands/holiday/holiday.service";
import LeaveCommand from "./commands/leave.command";
import { MeetingCommand } from "./commands/meeting/meeting.command";
import { MeetingService } from "./commands/meeting/meeting.service";
import { OrderCommand } from "./commands/Order/order.command";
import { OrderService } from "./commands/Order/order.service";
import { BotGateway } from "./events/bot.gateway";
import { CompanyTrip } from "./models/companyTrip.entity";
import { Daily } from "./models/daily.entity";
import { Holiday } from "./models/holiday.entity";
import { Leave } from "./models/leave.entity";
import { Meeting } from "./models/meeting.entity";
import { Order } from "./models/order.entity";
import { VoiceChannels } from "./models/voiceChannel.entity";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
import { Komubotrest } from "./untils/komubotrest.service";
import { UntilService } from "./untils/until.service";

@Module({
  imports: [
    DiscordModule.forFeature(),
    DiscoveryModule,
    TypeOrmModule.forFeature([
      Daily,
      Order,
      Leave,
      Holiday,
      CompanyTrip,
      Meeting,
      VoiceChannels,
    ]),
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
    CompantripCommand,
    BotGateway,
    DailyCommand,
    OrderCommand,
    MeetingCommand,
    holidayCommand,
    LeaveCommand,
    BotService,
    MeetingService,
    OrderService,
    UntilService,
    Komubotrest,
    CompanytripService,
    HolidayService,
  ],
  controllers: [BotController],
})
export class BotModule {}
