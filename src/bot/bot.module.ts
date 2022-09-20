import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { ChecklistCommand } from "./commands/checklist.command";
import { CompantripCommand } from "./commands/Companytrip/companytrip.command";
import { CompanytripService } from "./commands/Companytrip/companytrip.service";

import { DailyCommand } from "./commands/daily.command";
import holidayCommand from "./commands/holiday/holiday.command";
import { HolidayService } from "./commands/holiday/holiday.service";
// import { TestCommand } from "./commands/test";
// import LeaveCommand from "./commands/leave.command";
// import OrderCommand from "./commands/order.command";
import { BotGateway } from "./events/bot.gateway";
import { CheckList } from "./models/checklist.entity";
import { CompanyTrip } from "./models/companyTrip.entity";
import { Daily } from "./models/daily.entity";
import { Holiday } from "./models/holiday.entity";
import { Leave } from "./models/leave.entity";
import { Meeting } from "./models/meeting.entity";
import { Order } from "./models/order.entity";
import { Subcategorys } from "./models/subcategoryData.entity";
import { User } from "./models/user.entity";
import { VoiceChannels } from "./models/voiceChannel.entity";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
import { CheckListModule } from "./utils/checklist/checklist.module";
import { KomubotrestModule } from "./utils/komubotrest/kombotrest.module";
import { UntilService } from "./utils/until.service";

@Module({
  imports: [
    DiscordModule.forFeature(),
    DiscoveryModule,
    TypeOrmModule.forFeature([
      Daily,
      Order,
      Leave,
      Holiday,
      CheckList,
      Subcategorys,
      User,
      Meeting,
      VoiceChannels,
      CompanyTrip
    ]),
    KomubotrestModule,
    CheckListModule
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
    ChecklistCommand,
    CompantripCommand,
    BotGateway,
    DailyCommand,
    // OrderCommand,
    holidayCommand,
    // LeaveCommand,
    BotService,
    UntilService,
    // TestCommand,
    CompanytripService,
    HolidayService
  ],
  controllers: [BotController],
})
export class BotModule {}
