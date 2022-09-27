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
import { diskStorage } from "multer";
import { fileFilter, fileName } from "../helper";
import { Uploadfile } from "src/bot/models/uploadFile.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
@Controller()
@Injectable()
export class KomubotrestController {
  constructor(
    private komubotrestService: KomubotrestService,
    @InjectRepository(Uploadfile)
    private readonly uploadFileRepository: Repository<Uploadfile>
  ) {}

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
