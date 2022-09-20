import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { BotService } from "./bot.service";
import { Request, Response } from "express";
import { Message, Client } from "discord.js";
import { InjectDiscordClient } from "@discord-nestjs/core";

@Controller("bot")
export class BotController {
  constructor(
    private botService: BotService,
    @InjectDiscordClient()
    private client: Client
  ) {}

  @Post("/getUserIdByUsername")
  async getUserIdByUsername(@Req() req: Request, @Res() res: Response) {
    return this.botService.getUserIdByUsername(req, res);
  }
  @Post("/sendMessageToUser")
  async sendMessageToUser(@Req() req: Request, @Res() res) {
    return this.botService.sendMessageToUser(req, res);
  }
  @Post("/sendMessageToChannel")
  async sendMessageToChannel(@Req() req: Request, @Res() res) {
    return this.botService.sendMessageToChannel(req, res, this.client);
  }
  @Post("/sendImageCheckInToUser")
  async sendImageCheckInToUser(@Req() req: Request, @Res() res) {
    return this.botService.sendImageCheckInToUser(req, res);
  }
  @Post("/sendImageLabelToUser")
  async sendImageLabelToUser(@Req() req: Request, @Res() res) {
    return this.botService.sendImageLabelToUser(req, res);
  }
  @Post("/sendMessageToMachLeo")
  async sendMessageToMachLeo(@Req() req: Request, @Res() res) {
    return this.botService.sendMessageToMachLeo(req, res);
  }

  @Post("/sendMessageToThongBao")
  async sendMessageToThongBao(@Req() req: Request, @Res() res) {
    return this.botService.sendMessageToThongBao(req, res);
  }
  @Post("/sendMessageToThongBaoPM")
  async sendMessageToThongBaoPM(@Req() req: Request, @Res() res) {
    return this.botService.sendMessageToThongBaoPM(req, res);
  }
  @Post("/sendMessageToFinance")
  async sendMessageToFinance(@Req() req: Request, @Res() res) {
    return this.botService.sendMessageToFinance(req, res);
  }
  @Post("/deleteMessage")
  async deleteMessage(@Req() req: Request, @Res() res) {
    return this.botService.deleteMessage(req, res);
  }

  @Post("getUserCancel")
  async getUserCancel(@Req() req: Request, @Res() res: Response) {
    return this.botService.getUserCancel("", res);
  }

  @Get("GetAll")
  async findAll() {
    return this.botService.getAll();
  }
}
