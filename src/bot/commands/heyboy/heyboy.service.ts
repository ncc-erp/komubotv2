import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { CheckList } from "src/bot/models/checklistdata.entity";
import { Message } from "src/bot/models/msg.entity";
import { Subcategorys } from "src/bot/models/subcategoryData.entity";
import { User } from "src/bot/models/user.entity";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { Brackets, Repository } from "typeorm";

@Injectable()
export class HeyboyService{
    constructor(
        @InjectRepository(User)
        private userReposistory : Repository<User>
    ){}
    async findWomanUser(_emails){
        return await this.userReposistory
        .createQueryBuilder(TABLE.USER)
        .where(`${TABLE.USER}.email IN (:emails)`,{emails : _emails} )
        .andWhere(`${TABLE.USER}.deactive = :deactive`, {deactive : true})
        .getMany();
    }   
}