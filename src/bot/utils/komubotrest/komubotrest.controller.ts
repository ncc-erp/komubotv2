import { Controller, Injectable, Post, Req, Res } from "@nestjs/common";
import { Client } from "discord.js";
import { KomubotrestService } from "./komubotrest.service";
import { Request, Response } from "express";
import { InjectDiscordClient } from "@discord-nestjs/core";

@Controller()
@Injectable()
export class KomubotrestController {
  constructor(
    private komubotrestService: KomubotrestService,
    @InjectDiscordClient()
    private client: Client
  ) {}

  @Post("/getUserIdByUsername")
  async getUserIdByUsername(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.getUserIdByUsername(this.client, req, res);
  }

  @Post("/sendMessageToUser")
  async sendMessageToUser(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToUser(this.client, req, res);
  }

  @Post("/sendMessageToChannel")
  async sendMessageToChannel(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToChannel(this.client, req, res);
  }

  @Post("/sendImageCheckInToUser")
  async sendImageCheckInToUser(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendImageCheckInToUser(this.client, req, res);
  }
  @Post("/sendImageLabelToUser")
  async sendImageLabelToUser(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendImageLabelToUser(this.client, req, res);
  }

  @Post("/sendMessageToMachLeo")
  async sendMessageToMachLeo(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToMachLeo(this.client, req, res);
  }

  @Post("/sendMessageToThongBao")
  async sendMessageToThongBao(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToThongBao(this.client, req, res);
  }

  @Post("/sendMessageToThongBaoPM")
  async sendMessageToThongBaoPM(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToThongBaoPM(this.client, req, res);
  }
  @Post("/sendMessageToFinance")
  async sendMessageToFinance(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToFinance(this.client, req, res);
  }

  @Post("/sendEmbedMessage")
  async sendEmbedMessage(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendEmbedMessage(this.client, req, res);
  }

  @Post("/deleteMessage")
  async deleteMessage(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.deleteMessage(this.client, req, res);
  }
}
