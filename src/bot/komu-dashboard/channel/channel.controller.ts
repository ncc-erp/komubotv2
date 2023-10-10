import { InjectDiscordClient } from "@discord-nestjs/core";
import { Controller, Get, Query, UseGuards, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Client } from "discord.js";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ChannelService } from "./channel.service";
import { getListChannel, getListChannelMember, PostRemoteMemberChannel, GetSearchMemberChannel } from "./dto/channel.dto";

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

  @Get("viewMember")
  @UseGuards(JWTAuthGuard)
  async getViewChannell(@Query() query: getListChannelMember) {
    return await this.channelService.getViewChannell(query);
  }

  @Post("remoteMember")
  @UseGuards(JWTAuthGuard)
  async postRemoteMemberChannel(@Body() query: PostRemoteMemberChannel) {
    return await this.channelService.postRemoteMemberChannel(query);
  }

  @Get("searchMember")
  @UseGuards(JWTAuthGuard)
  async getSearchMemberChannel(@Query() query: GetSearchMemberChannel) {
    return await this.channelService.getSearchMemberChannel(query);
  }

  @Post("addMember")
  @UseGuards(JWTAuthGuard)
  async postAddMemberChannel(@Body() query: PostRemoteMemberChannel) {
    return await this.channelService.postAddMemberChannel(query);
  }
}
