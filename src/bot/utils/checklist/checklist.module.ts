import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { Channel } from "src/bot/models/channel.entity";
import { CheckList } from "src/bot/models/checklist.entity";
import { Daily } from "src/bot/models/daily.entity";
import { Holiday } from "src/bot/models/holiday.entity";
import { Msg } from "src/bot/models/msg.entity";
import { Subcategorys } from "src/bot/models/subcategoryData.entity";
import { Uploadfile } from "src/bot/models/uploadFile.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { UserNotDailyService } from "../getUserNotDaily/getUserNotDaily.service";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { UtilsService } from "../utils.service";
import { CheckListController } from "./checklist.controller";
import { CheckListService } from "./checklist.service";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CheckList,
      Subcategorys,
      Msg,
      WorkFromHome,
      Channel,
      User,
      Daily,
      Uploadfile,
      Holiday,
    ]),
    HttpModule,
  ],
  exports: [CheckListController, KomubotrestService, ClientConfigService],
  providers: [
    CheckListService,
    CheckListController,
    KomubotrestService,
    KomubotrestService,
    ClientConfigService,
    UtilsService,
    ConfigService,
    UserNotDailyService,
  ],
})
export class CheckListModule {}
