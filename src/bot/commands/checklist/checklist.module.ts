import {Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckList } from 'src/bot/models/checklist.entity';
import { Subcategorys } from 'src/bot/models/subcategoryData.entity';
import { ChecklistCommand } from '../checklist.command'
import { CheckListController } from "./checklist.controller";
import { CheckListService } from "./checklist.service";

@Global()
@Module({
    imports : [
        TypeOrmModule.forFeature([CheckList, Subcategorys])
    ],
    exports : [
        CheckListController
    ],
    providers : [
        CheckListService, CheckListController
    ],
    // controllers : [
    //     CheckListController,
    // ]
})
export class CheckListModule{}