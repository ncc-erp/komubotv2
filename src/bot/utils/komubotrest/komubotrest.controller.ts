import { Controller, Injectable, Post, Req, Res } from "@nestjs/common";
import { Client } from "discord.js";
import { KomubotrestService } from "./komubotrest.service";
import { Request, Response } from "express";
@Controller()
@Injectable()
export class KomubotrestController {
  constructor(private komubotrestService: KomubotrestService) {}

  @Post("/getUserIdByUsername")
  async getUserIdByUsername(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.getUserIdByUsername(Client, req, res);
  }

  @Post("/sendMessageToUser")
  async sendMessageToUser(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToUser(Client, req, res);
  }

  @Post("/sendMessageToChannel")
  async sendMessageToChannel(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToChannel(Client, req, res);
  }

  @Post("/sendImageCheckInToUser")
  async sendImageCheckInToUser(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendImageCheckInToUser(Client, req, res);
  }
  @Post("/sendImageLabelToUser")
  async sendImageLabelToUser(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendImageLabelToUser(Client, req, res);
  }

  @Post("/sendMessageToMachLeo")
  async sendMessageToMachLeo(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToMachLeo(Client, req, res);
  }

  @Post("/sendMessageToThongBao")
  async sendMessageToThongBao(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToThongBao(Client, req, res);
  }

  @Post("/sendMessageToThongBaoPM")
  async sendMessageToThongBaoPM(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToThongBaoPM(Client, req, res);
  }
  @Post("/sendMessageToFinance")
  async sendMessageToFinance(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToFinance(Client, req, res);
  }

  @Post("/sendEmbedMessage")
  async sendEmbedMessage(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendEmbedMessage(Client, req, res);
  }

  @Post("/deleteMessage")
  async deleteMessage(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.deleteMessage(Client, req, res);
  }
}
