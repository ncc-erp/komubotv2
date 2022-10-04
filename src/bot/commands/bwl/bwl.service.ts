import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { CompanyTrip } from "src/bot/models/companyTrip.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Bwl } from "src/bot/models/bwl.entity";
import { User } from "discord.js";
import { BwlReaction } from "src/bot/models/bwlReact.entity";

@Injectable()
export class BWLService {
  constructor(
    @InjectRepository(Bwl)
    private bwlRepository: Repository<Bwl>,
    @InjectRepository(BwlReaction)
    private bwlReactionRepository: Repository<BwlReaction>, 
    @InjectRepository(User)
    private userRepository: Repository<User>
    ) {}
    async findBwlReactData(_channelId, firstday, lastday, top){
      return await this.bwlReactionRepository.createQueryBuilder("bwlReaction")
      .select("COUNT(bwlReaction.author)", "totalReaction")
      .addSelect("bwlReaction.bwl")
      .addSelect("author.username")
      .innerJoin("bwlReaction.bwl", "bwl")
      .innerJoin('bwl.author', 'author')
      .where(`bwlReaction.channel =:channel`, {channel : _channelId})
      .andWhere(qb=>{
        qb.where('bwl.createdTimestamp <= :lastday', {
          lastday
        }).andWhere('bwl.createdTimestamp >= :firstday', {
          firstday 
        })
      })
      .groupBy("bwlReaction.bwl")
      .addGroupBy("bwlReaction.author")
      .addGroupBy("author.username")
      .orderBy("COUNT(bwlReaction.author)", "DESC")
       .limit(top)
      .execute();
    }
}