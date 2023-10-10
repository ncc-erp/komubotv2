import { Controller, Get, HttpCode, HttpStatus, Injectable, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PenaltyService } from "./penalty.service";
import { getListPenalty } from "./dto/penalty.dto";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { Client } from "discord.js";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Penalty")
@Controller("penalty")
@Injectable()
export class PenaltyController {
  constructor(
    private readonly penaltyService: PenaltyService,
    @InjectDiscordClient()
    private client: Client
  ) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  async findAll(@Query() query: getListPenalty) {
    return await this.penaltyService.findAll(query, this.client);
  }

  @Get('amount')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
    async getAmountAdmin() {
        return await this.penaltyService.getAmountPenalty();
    }
}
