import { InjectDiscordClient } from "@discord-nestjs/core";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Client } from "discord.js";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { DailyService } from "./daily.service";
import { getListDaily } from "./dto/daily.dto";

@ApiTags("Daily")
@Controller("daily")
export class DailyController {
  constructor(
    private readonly dailyService: DailyService,
    @InjectDiscordClient()
    private client: Client
  ) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  async reportDaily(@Query() query: getListDaily) {
    return await this.dailyService.reportDaily(query, this.client);
  }
}
