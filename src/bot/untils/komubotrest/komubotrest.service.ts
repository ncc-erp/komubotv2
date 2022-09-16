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
export class KomubotrestService {
    constructor(
        @InjectRepository(User)
        private userReposistory : Repository<User>,
        @InjectRepository(Message)
        private messageReposistory : Repository<Message>,
        @InjectRepository(WorkFromHome)
        private wfhReposistory : Repository<WorkFromHome>,
    ){}
    async findUserData(_pramams){
        return await this.userReposistory
        .createQueryBuilder(TABLE.USER)
        .where(
            new Brackets((qb)=>{
                qb.where(`${TABLE.USER}.email = :email`, {email : _pramams})
                .andWhere(`${TABLE.USER}.deactive = :deactive`, {deactive : false})
            })
        )
        .orWhere(
            new Brackets((qb)=>{
                qb.where(`${TABLE.USER}.username = :username`, {username : _pramams})
                .andWhere(`${TABLE.USER}.deactive = :deactive`, {deactive : false})
            })
        )
        .getOne();
        
    }
    async insertNewMsg(sent){
        return await this.messageReposistory
        .createQueryBuilder()
        .insert()
        .into(TABLE.MSG)
        .values([
            {
                //? unknown props of sent
                sent    
            }
        ])
        .returning("*");
    }
    async replaceDataUser(){
        return await this.messageReposistory
        .createQueryBuilder()
        .insert()
        .into(TABLE.USER)
        .values([

        ]).execute();
    }
    async insertDataToWFH(_userid,
        _wfhMsg,
        _complain,
        _pmconfirm,
        _status){
        return await this.wfhReposistory
        .createQueryBuilder()
        .insert()
        .into(TABLE.WFH)
        .values({
            userid : _userid,
            wfhMsg : _wfhMsg,
            complain : _complain,
            pmconfirm : _pmconfirm,
            status : _status
        }).execute();
    }
}


