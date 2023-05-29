import { InjectDiscordClient } from "@discord-nestjs/core";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Client } from "discord.js";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ChannelService } from "./channel.service";
import { getListChannel } from "./dto/channel.dto";

@ApiTags("Channel")
@Controller("channel")
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    @InjectDiscordClient()
    private client: Client
  ) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  async findAll(@Query() query: getListChannel) {
    return await this.channelService.findAll(query, this.client);
  }
}
