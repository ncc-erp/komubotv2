import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MeetingService } from "./meeting.service";
import { getListMeeting } from "./dto/meeting.dto";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { Client } from "discord.js";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Meeting")
@Controller("meeting")
export class MeetingController {
  constructor(
    private readonly meetingService: MeetingService,
    @InjectDiscordClient()
    private client: Client
  ) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  async findAll(@Query() query: getListMeeting) {
    return await this.meetingService.findAll(query, this.client);
  }
}
