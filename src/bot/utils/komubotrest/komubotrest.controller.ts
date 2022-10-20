import {
  Body,
  Controller,
  Headers,
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
import { GetUserIdByUsernameDTO } from "src/bot/dto/getUserIdByUsername";
import { SendMessageToUserDTO } from "src/bot/dto/sendMessageToUser";
import { SendMessageToChannelDTO } from "src/bot/dto/sendMessageToChannel";
import { DeleteMessageDTO } from "src/bot/dto/deleteMessage";
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
  async getUserIdByUsername(
    @Body() getUserIdByUsernameDTO: GetUserIdByUsernameDTO,
    @Headers("X-Secret-Key") header,
    @Res() res: Response
  ) {
    return this.komubotrestService.getUserIdByUsername(
      this.client,
      getUserIdByUsernameDTO,
      header,
      res
    );
  }

  @Post("/sendMessageToUser")
  async sendMessageToUser(
    @Body() sendMessageToUserDTO: SendMessageToUserDTO,
    @Headers("X-Secret-Key") header,
    @Res() res: Response
  ) {
    return this.komubotrestService.sendMessageToUser(
      this.client,
      sendMessageToUserDTO,
      header,
      res
    );
  }

  @Post("/sendMessageToChannel")
  async sendMessageToChannel(
    @Body() sendMessageToChannelDTO: SendMessageToChannelDTO,
    @Headers("X-Secret-Key") header,
    @Res() res: Response
  ) {
    return this.komubotrestService.sendMessageToChannel(
      this.client,
      sendMessageToChannelDTO,
      header,
      res
    );
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
  async sendMessageToMachLeo(
    @Body() sendMessageToChannelDTO: SendMessageToChannelDTO,
    @Headers("X-Secret-Key") header,
    @Res() res: Response
  ) {
    return this.komubotrestService.sendMessageToMachLeo(
      this.client,
      sendMessageToChannelDTO,
      header,
      res
    );
  }

  @Post("/sendMessageToThongBao")
  async sendMessageToThongBao(
    @Body() sendMessageToChannelDTO: SendMessageToChannelDTO,
    @Headers("X-Secret-Key") header,
    @Res() res: Response
  ) {
    return this.komubotrestService.sendMessageToThongBao(
      this.client,
      sendMessageToChannelDTO,
      header,
      res
    );
  }

  @Post("/sendMessageToThongBaoPM")
  async sendMessageToThongBaoPM(
    @Body() sendMessageToChannelDTO: SendMessageToChannelDTO,
    @Headers("X-Secret-Key") header,
    @Res() res: Response
  ) {
    return this.komubotrestService.sendMessageToThongBaoPM(
      this.client,
      sendMessageToChannelDTO,
      header,
      res
    );
  }
  @Post("/sendMessageToFinance")
  async sendMessageToFinance(
    @Body() sendMessageToChannelDTO: SendMessageToChannelDTO,
    @Headers("X-Secret-Key") header,
    @Res() res: Response
  ) {
    return this.komubotrestService.sendMessageToFinance(
      this.client,
      sendMessageToChannelDTO,
      header,
      res
    );
  }

  @Post("/sendEmbedMessage")
  async sendEmbedMessage(@Req() req: Request, @Res() res: Response) {
    return this.komubotrestService.sendEmbedMessage(this.client, req, res);
  }
  //xong
  @Post("/deleteMessage")
  async deleteMessage(
    @Body() deleteMessageDTO: DeleteMessageDTO,
    @Res() res: Response
  ) {
    deleteMessage(this.client, deleteMessageDTO, res);
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
