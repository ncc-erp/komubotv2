import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Msg } from "src/bot/models/msg.entity";
import { Uploadfile } from "src/bot/models/uploadFile.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { CheckListModule } from "../checklist/checklist.module";
import { KomubotrestController } from "./komubotrest.controller";
import { KomubotrestService } from "./komubotrest.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Msg, WorkFromHome, Uploadfile])],
  exports: [KomubotrestService, KomubotrestController, Uploadfile],
  providers: [KomubotrestService, KomubotrestController, Uploadfile],
})
export class KomubotrestModule {}
