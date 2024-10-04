import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UseInterceptors,
  UsePipes,
} from "@nestjs/common";
import { Client } from "discord.js";
import { KomubotrestService } from "./komubotrest.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { google } from "googleapis";
import { join } from "path";
import { createReadStream } from "fs";
import { diskStorage } from "multer";
import { fileFilter, fileName, imageName } from "../helper";
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
import { GetListInfoUserDto, GetUserIdByEmailDTO } from "src/bot/dto/getUserIdByEmail";
import { RegexEmailPipe } from "src/bot/middleware/regex-email";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { ReportDailyDTO } from "./komubotrest.dto";
import { ApiTags } from "@nestjs/swagger";
import { UserNotDailyService } from "../getUserNotDaily/getUserNotDaily.service";
import { parse } from "date-fns";
import { ReportWFHService } from "../reportWFH/report-wfh.service";
import { FileType } from "src/bot/constants/enum";

@ApiTags("Komu")
@Controller()
@Injectable()
export class KomubotrestController {
  constructor(
    private komubotrestService: KomubotrestService,
    @InjectDiscordClient()
    private client: Client,
    private clientConfigService: ClientConfigService,
    private userNotDailyService: UserNotDailyService,
    private reportWFHService: ReportWFHService,
    @InjectRepository(Uploadfile)
    private readonly uploadFileRepository: Repository<Uploadfile>
  ) { }
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
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: imageName,
      }),
      limits: {
        fileSize: 1024 * 1024 * 100,
      },
      fileFilter: fileFilter,
    })
  )
  @UsePipes(RegexEmailPipe)
  async sendMessageToChannel(
    @Body() sendMessageToChannelDTO: SendMessageToChannelDTO,
    @Headers("X-Secret-Key") header,
    @Req() req: Request,
    @Res() res: Response
  ) {
    sendMessageToChannelDTO.file = req.file;
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
  @UsePipes(RegexEmailPipe)
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
  @UsePipes(RegexEmailPipe)
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
  @UsePipes(RegexEmailPipe)
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
  @UsePipes(RegexEmailPipe)
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
      file_type: FileType.NCC8,
    });
    try {
      const oauth2Client = new google.auth.OAuth2(
        this.clientConfigService.driverClientId,
        this.clientConfigService.driverClientSecret,
        this.clientConfigService.driverRedirectId
      );
      oauth2Client.setCredentials({
        refresh_token: this.clientConfigService.driverRefreshToken,
      });

      const drive = google.drive({
        version: "v3",
        auth: oauth2Client,
      });

      const nccPath = join(__dirname, "../../../..", "uploads/");
      await drive.files.create({
        requestBody: {
          name: `NCC8.${episode}_mixdown.mp3`,
          mimeType: file.mimetype,
          parents: [this.clientConfigService.driverFolderParentId],
        },
        media: {
          mimeType: file.mimetype,
          body: createReadStream(join(nccPath + file.filename)),
        },
      });
    } catch (error) {
      console.log(error.message);
    }
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

  @Get("/getDailyReport")
  async getDailyReport(@Query() query: { date: string }) {
    const date = parse(query.date, 'dd/MM/yyyy', new Date());
    const { notDaily } = await this.userNotDailyService.getUserNotDaily(date);
    const mention = await this.reportWFHService.reportMachleo(date);

    return { daily: notDaily, mention };
  }

  @Get("/reportDaily")
  async reportDaily(@Query() query: ReportDailyDTO) {
    return await this.komubotrestService.getReportUserDaily(query, this.client);
  }

  @Get("/ncc8/download")
  async getFile(@Res({ passthrough: true }) res: Response) {
    try {
      const nccPath = join(__dirname, "../../../..", "uploads/");

      const fileDownload = await this.komubotrestService.downloadFile();
      const file = createReadStream(join(nccPath + fileDownload[0].fileName));

      res.set({
        "Content-Type": "audio/mp3",
        "Content-Disposition": `attachment; filename=${fileDownload[0].fileName}`,
      });
      return new StreamableFile(file);
    } catch (error) {
      console.log(error);
    }
  }

  @Post("bitbucket/webhook")
  async bitbucketWebhookGetStatusBuild(
    @Req() req,
    @Headers("X-Event-Key") event
  ) {
    const data = req.body;
    return await this.komubotrestService.bitbucketWebhook(
      this.client,
      data,
      event
    );
  }

  @Post("jira/webhook")
  async jiraWebhook(
    @Req() req) {
    const data = req.body;
    return await this.komubotrestService.jiraWebhook(
      this.client,
      data
    );
  }
  @Post("/getListInfoUser")
  async getListInfoUser(@Body() getListInfoUser: GetListInfoUserDto) {
    return await this.komubotrestService.getListInfoUser(getListInfoUser);
  }

  @Post("/migrateUserType")
  async migrateUserType(
    @Headers("X-Secret-Key") header,
    @Res() res: Response
  ) {
    this.komubotrestService.migrateUserType(
      this.client,
      header
    );
    res.status(200).send({ message: 'migrating...' });
  }

  @Get("/ncc8/episode/:episode")
  async getNcc8Episode(
    @Param('episode') episode: string,
    // @Res({ passthrough: true }) res: Response
    @Res() res: Response
  ) {
    try {
      const file = await this.komubotrestService.getNcc8Episode(episode, FileType.NCC8);
      if (!file?.length) {
        res.status(404).send({ message: 'Not found' });
        return;
      }

      const nccPath = join(__dirname, "../../../..", "uploads/");

      res.status(200).json({ url: join(nccPath + file[0].fileName) })
  
      // const mp3 = createReadStream(join(nccPath + file[0].fileName));
  
      // res.set({
      //   "Content-Type": "audio/mp3",
      //   "Content-Disposition": `attachment; filename=${file[0].fileName}`,
      // });
      // return new StreamableFile(mp3);
    } catch (error) {
      console.error('getNcc8Episode error', error);
      res.status(500).send({ message: 'Server error' });
    }
  }

  @Get("/ncc8/film/:episode")
  async getNcc8Film(
    @Param('episode') episode: string,
    @Res() res: Response
  ) {
    try {
      const file = await this.komubotrestService.getNcc8Episode(episode, FileType.FILM);
      if (!file?.length) {
        res.status(404).send({ message: 'Not found' });
        return;
      }

      const nccPath = "/home/nccsoft/projects/uploads/";

      res.status(200).json({ url: join(nccPath + file[0].fileName) })
    } catch (error) {
      console.error('getNcc8Episode error', error);
      res.status(500).send({ message: 'Server error' });
    }
  }
}
