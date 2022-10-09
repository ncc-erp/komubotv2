import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BwlReaction } from "src/bot/models/bwlReact.entity";
import { Repository } from "typeorm";

@Injectable()
export class BWLService {
  constructor(
    @InjectRepository(BwlReaction)
    private bwlReactionRepository: Repository<BwlReaction>
  ) {}
  async findBwlReactData(_channelId, firstday, lastday, top) {
    return await this.bwlReactionRepository
      .createQueryBuilder("bwlReaction")
      .select("COUNT(bwlReaction.author)", "totalReaction")
      .addSelect("bwlReaction.bwl")
      .addSelect("author.username")
      .innerJoin("bwlReaction.bwl", "bwl")
      .innerJoin("bwl.author", "author")
      .where(`bwlReaction.channel =:channel`, { channel: _channelId })
      .andWhere((qb) => {
        qb.where("bwl.createdTimestamp <= :lastday", {
          lastday,
        }).andWhere("bwl.createdTimestamp >= :firstday", {
          firstday,
        });
      })
      .groupBy("bwlReaction.bwl")
      .addGroupBy("bwlReaction.author")
      .addGroupBy("author.username")
      .having("count(1) = :number", { number: 1 })
      .orderBy("COUNT(bwlReaction.author)", "DESC")
      .limit(top)
      .execute();
  }
}
