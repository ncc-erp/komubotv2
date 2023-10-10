import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { MessageService } from "./message.service";
import { getListMessage } from "./dto/message.dto";
import { ApiTags } from "@nestjs/swagger";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { Client } from "discord.js";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Message")
@Controller("message")
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    @InjectDiscordClient()
    private client: Client
  ) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  async findAll(@Query() query: getListMessage) {
    return await this.messageService.findAll(query, this.client);
  }
}
