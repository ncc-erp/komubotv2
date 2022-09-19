import { DiscordModule } from "@discord-nestjs/core";
import { forwardRef, Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { ChecklistCommand } from "./commands/checklist.command";
import { CheckListModule } from "./commands/Checklist/checklist.module";
import { CompantripCommand } from "./commands/Companytrip/companytrip.command";
import { CompanyModule } from "./commands/Companytrip/companytrip.module";

import { DailyCommand } from "./commands/daily.command";
import holidayCommand from "./commands/holiday.command";
import { MeetingCommand } from "./commands/meeting/meeting.command";
import { MeetingService } from "./commands/meeting/meeting.service";
// import { TestCommand } from "./commands/test";
// import LeaveCommand from "./commands/leave.command";
// import OrderCommand from "./commands/order.command";
import { BotGateway } from "./events/bot.gateway";
import { Daily } from "./models/daily.entity";
import { Holiday } from "./models/holiday.entity";
import { Leave } from "./models/leave.entity";
import { Meeting } from "./models/meeting.entity";
import { Order } from "./models/order.entity";
import { User } from "./models/user.entity";
import { VoiceChannels } from "./models/voiceChannel.entity";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
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
      User,
      Meeting,
      VoiceChannels,
    ]),
    forwardRef(() => CheckListModule),
    CompanyModule,
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
    MeetingCommand,
    MeetingService,
  ],
  controllers: [BotController],
})
export class BotModule {}
