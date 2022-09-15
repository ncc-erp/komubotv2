import {  InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { CompanyTrip } from "src/bot/models/companyTrip.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";



@Injectable()
export class CompanytripService {
    constructor(
        @InjectRepository(CompanyTrip)
        private companyRepository : Repository<CompanyTrip>
    ){}
    async findUserMention(filter){
        return await this.companyRepository
        .createQueryBuilder(TABLE.COMPANYTRIP)
        .where(`${TABLE.COMPANYTRIP}.email = :email`, { email: filter.email })
        .andWhere(`${TABLE.COMPANYTRIP}.year = :year`, {year : filter.year})
        .andWhere(`${TABLE.COMPANYTRIP}.userId = :userId`, {userId : filter.userId})
        .getMany();
     }

     async findlistUserRoomMention(room, currentYear){
        return await this.companyRepository
        .createQueryBuilder(TABLE.COMPANYTRIP)
        .where(`${TABLE.COMPANYTRIP}.room = :room`, { room: room })
        .andWhere(`${TABLE.COMPANYTRIP}.year = :year`, {year : currentYear})
        .getMany();
     }
     async findUser(author, currentYear){
        return await this.companyRepository
        .createQueryBuilder(TABLE.COMPANYTRIP)
        .where(`${TABLE.COMPANYTRIP}.userId = :userId`, { userId: author })
        .andWhere(`${TABLE.COMPANYTRIP}.year = :year`, {year : currentYear})
        .getMany();
     }
}