import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Channel } from "src/bot/models/channel.entity";
import { Msg } from "src/bot/models/msg.entity";
import { Uploadfile } from "src/bot/models/uploadFile.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { KomubotrestService } from "./komubotrest.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Msg, Channel, WorkFromHome, Uploadfile]),
  ],
  exports: [KomubotrestService, KomubotrestService, Uploadfile],
  providers: [KomubotrestService, KomubotrestService, Uploadfile],
})
export class KomubotrestModule {}
