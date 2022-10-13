import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { Channel } from "src/bot/models/channel.entity";
import { CheckList } from "src/bot/models/checklist.entity";
import { Msg } from "src/bot/models/msg.entity";
import { Subcategorys } from "src/bot/models/subcategoryData.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
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
    ]),
  ],
  exports: [CheckListController, KomubotrestService, ClientConfigService],
  providers: [
    CheckListService,
    CheckListController,
    KomubotrestService,
    KomubotrestService,
    ClientConfigService,
    ConfigService,
  ],
})
export class CheckListModule {}
