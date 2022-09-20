import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/bot/models/msg.entity";
import { User } from "src/bot/models/user.entity";
import { WFH } from "src/bot/models/wfh.entity";
import { KomubotrestController } from "./komubotrest.controller";
import { KomubotrestService } from "./komubotrest.service";


@Module({
    imports : [TypeOrmModule.forFeature([User, Message,  WFH])],
    exports : [KomubotrestService, KomubotrestController],
    providers : [KomubotrestService, KomubotrestController], 
    controllers : []
})
export class KomubotrestModule{}