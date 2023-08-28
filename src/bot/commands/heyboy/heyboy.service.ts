import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class HeyboyService{
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>
    ){}
    async findWomanUser(_emails){
        return await this.userRepository
        .createQueryBuilder(TABLE.USER)
        .where(`${TABLE.USER}.email IN (:emails)`,{emails : _emails} )
        .andWhere(`${TABLE.USER}.deactive = :deactive`, {deactive : true})
        .getMany();
    }   
}