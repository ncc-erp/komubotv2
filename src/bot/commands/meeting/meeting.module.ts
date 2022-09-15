import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Meeting } from "src/bot/models/meeting.entity";
import { UntilService } from "src/bot/untils/until.service";
import { MeetingService } from "./meeting.service";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Meeting, UntilService])],
  exports: [MeetingService],
  providers: [MeetingService],
})
export class MeetingModule {}
