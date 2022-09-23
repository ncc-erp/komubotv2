import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { fileFilter, fileName } from "./utils/helper";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Uploadfile } from "./models/uploadFile.entity";
import { FileInterceptor } from "@nestjs/platform-express";

import { BotService } from "./bot.service";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { HelperFile } from "./shared/helper";

@Controller("bot")
export class BotController {
  constructor(
    private botService: BotService,
    @InjectRepository(Uploadfile)
    private readonly uploadFileRepository: Repository<Uploadfile>
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
    return this.botService.sendMessageToChannel(req, res);
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

  @Get("GetAll")
  async findAll() {
    return this.botService.getAll();
  }
}
