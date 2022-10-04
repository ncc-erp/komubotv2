import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { CompanyTrip } from "src/bot/models/companyTrip.entity";
import { Repository , getConnection} from "typeorm";
import { Injectable } from "@nestjs/common";
import { BWL } from "src/bot/models/bwl.entity";
import { User } from "discord.js";
import { BwlReaction } from "src/bot/models/bwlReact.entity";

@Injectable()
export class BWLService {
  constructor(
    @InjectRepository(BWL)
    private bwlRepository: Repository<BWL>,
    @InjectRepository(BwlReaction)
    private bwlReactionRepository: Repository<BwlReaction>, 
    @InjectRepository(User)
    private userRepository: Repository<User>
    ) {}
    async findBwlReactData(_channelId, firstday, lastday){
      return await this.bwlReactionRepository.createQueryBuilder(`${TABLE.BWLREACTION}`)
      .innerJoinAndSelect(`${TABLE.BWLREACTION}.${TABLE.BWL}`, "bwl")
      .where(`${TABLE.BWLREACTION}.channelId =:channelId`, {channelId : _channelId})
      .execute();
    }
}