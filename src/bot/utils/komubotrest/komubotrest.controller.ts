import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  Query,
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
import {
  SendImageCheckInToUserDTO,
  SendImageLabelToUserDTO,
} from "src/bot/dto/sendImageCheckInToUser";
import { SendEmbedMessageDTO } from "src/bot/dto/sendEmbedMessage";
import { GetUserIdByEmailDTO } from "src/bot/dto/getUserIdByEmail";
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
  async sendImageCheckInToUser(
    @Body() sendImageCheckInToUserDTO: SendImageCheckInToUserDTO,
    @Headers("X-Secret-Key") header,
    @Res() res: Response
  ) {
    return this.komubotrestService.sendImageCheckInToUser(
      this.client,
      sendImageCheckInToUserDTO,
      header,
      res
    );
  }
  @Post("/sendImageLabelToUser")
  async sendImageLabelToUser(
    @Body() sendImageLabelToUserDTO: SendImageLabelToUserDTO,
    @Headers("X-Secret-Key") header,
    @Res() res: Response
  ) {
    return this.komubotrestService.sendImageLabelToUser(
      this.client,
      sendImageLabelToUserDTO,
      header,
      res
    );
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
  async sendEmbedMessage(
    @Body() sendEmbedMessageDTO: SendEmbedMessageDTO,
    @Headers("X-Secret-Key") header,
    @Res() res: Response
  ) {
    return this.komubotrestService.sendEmbedMessage(
      this.client,
      sendEmbedMessageDTO,
      header,
      res
    );
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
  async uploadFileNCC8(@Req() req: Request, @Res() res: Response) {
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

  @Get("/getInfoUserByEmail")
  async getInfoUser(@Query() getUserByEmailDto: GetUserIdByEmailDTO) {
    return await this.komubotrestService.getInfoUserByEmail(getUserByEmailDto);
  }

  @Get("/getUserNotDaily")
  async getUserNotDaily() {
    return await this.komubotrestService.getUserNotDaily();
  }
}
