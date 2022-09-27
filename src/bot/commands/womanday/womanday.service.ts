import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class WomanDayService{
    constructor(
        @InjectRepository(User)
        private userReposistory : Repository<User>
    ){}
    async findWomanUser(userWomenTest){
        return await this.userReposistory
        .createQueryBuilder(TABLE.USER)
        .select([`${TABLE.USER}.id`, `${TABLE.USER}.email`])
        .where(`${TABLE.USER}.email IN (:emails)`,{emails : userWomenTest} )
        .andWhere(`${TABLE.USER}.deactive = :deactive`, {deactive : false})
        .getMany();
    }   

}