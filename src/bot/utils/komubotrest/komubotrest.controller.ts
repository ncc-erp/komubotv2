import { Controller, Injectable, Post, Req, Res } from "@nestjs/common";
import { createError } from "http-errors";
import {
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "discord.js";
import { KomubotrestService } from "./komubotrest.service";
import { deleteMessage } from "../deleteMessage.utils";
import { Request, Response } from "express";
import bodyParserfrom from "body-parser";
import multer from "multer";
import cors from "cors";
import { Uploadfile } from "src/bot/models/uploadFile.entity";

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

  sendErrorToDevTest = async (client, authorId, err) => {
    const msg = `KOMU không gửi được tin nhắn cho <@${authorId}> message: ${err.message} httpStatus: ${err.httpStatus} code: ${err.code}.`;
    await client.channels.cache
      .get(process.env.KOMUBOTREST_DEVTEST_CHANNEL_ID)
      .send(msg)
      .catch(console.error);
    return null;
  };
  sendMessageToNhaCuaChung = async (client, msg) => {
    await client.channels.cache
      .get(process.env.KOMUBOTREST_NHACUACHUNG_CHANNEL_ID)
      .send(msg)
      .catch(console.error);
    return null;
  };
  getWFHWarninghMessage = (content, userId, wfhId) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("komu_wfh_complain#" + userId + "#" + wfhId)
        .setLabel("I'am in daily call")
        .setEmoji("⏳")
        .setStyle(4),
      new ButtonBuilder()
        .setCustomId("komu_wfh_accept#" + userId + "#" + wfhId)
        .setLabel("Accept")
        .setEmoji("✍")
        .setStyle(1)
    );
    return { content, components: [row] };
  };
}
