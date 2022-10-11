import {
  Controller,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  Req,
  Res,
  UseInterceptors,
} from "@nestjs/common";
import { Client } from "discord.js";
import { KomubotrestService } from "./komubotrest.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { InjectDiscordClient } from "@discord-nestjs/core";

import { diskStorage } from "multer";
import { fileFilter, fileName } from "../helper";
import { Uploadfile } from "src/bot/models/uploadFile.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { deleteMessage } from "../deleteMessage.utils";
@Controller()
@Injectable()
export class KomubotrestController {
  constructor(
    private komubotrestService: KomubotrestService,
    @InjectDiscordClient()
    private client: Client,
    @InjectRepository(Uploadfile)
    private readonly uploadFileRepository: Repository<Uploadfile>
  ) {}
  //xong
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
    return this.komubotrestService.sendImageCheckInToUser(
      this.client,
      req,
      res
    );
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
    return this.komubotrestService.sendMessageToThongBaoPM(
      this.client,
      req,
      res
    );
  }
  @Post("/sendMessageToFinance")
  async sendMessageToFinance(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendMessageToFinance(this.client, req, res);
  }

  @Post("/sendEmbedMessage")
  async sendEmbedMessage(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendEmbedMessage(this.client, req, res);
  }
//xong
  @Post("/deleteMessage")
  async deleteMessage(@Req() req: Request, @Res() res: Response) {
   deleteMessage(this.client, req, res);
  }
//xong
  @Post("/uploadFile")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: fileName,
      }),
      limits: {
        fileSize: 1024 * 1024 * 100,
      },
      fileFilter: fileFilter,
    })
  )
  async uploadAvatar(@Req() req: Request, @Res() res: Response) {
    const file = req.file;
    if (!file) {
      throw new HttpException("Please upload a file", HttpStatus.NOT_FOUND);
    }
    if (!req.body.episode) {
      throw new HttpException(
        "Episode can not be empty!",
        HttpStatus.NOT_FOUND
      );
    }

    const episode = req.body.episode;
    await this.uploadFileRepository.insert({
      filePath: file.path,
      fileName: `${file.filename}`,
      createTimestamp: Date.now(),
      episode,
    });
    res.send(file);
  }
}
