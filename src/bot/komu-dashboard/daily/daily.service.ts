import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "discord.js";
import { Daily } from "src/bot/models/daily.entity";
import { formatPaging } from "src/bot/utils/formatter";
import { GetNameChannelService } from "src/bot/utils/getFullNameChannel/getFullNameChannel.service";
import { Repository } from "typeorm";
import { getListDaily } from "./dto/daily.dto";
import { User } from "src/bot/models/user.entity";

@Injectable()
export class DailyService {
  constructor(
    private getNameChannelService: GetNameChannelService,
    @InjectRepository(Daily)
    private dailyRepository: Repository<Daily>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async reportDaily(query: getListDaily, client: Client): Promise<any> {
    const { email, from, to, page, size, sort, filter } = query;

    const paging = formatPaging(page, size, sort);
    
    if(filter){
      if(filter === "Not"){
        const queryBuilder = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.userId', 'user.email', 'user.avatar'])
        .leftJoinAndSelect('komu_daily', 'daily', 'daily.userid = user.userId AND daily.createdAt >= :gtecreatedAt AND daily.createdAt < :ltecreatedAt', { gtecreatedAt: query.from, ltecreatedAt: query.to })
        .where('daily.email IS NULL')
        .andWhere('user.deactive IS false')
        .take(paging.query.take)
        .skip(paging.query.skip)
        .orderBy('user.email', paging.query.sort as any);

        if (email) {
          queryBuilder.andWhere(`user.email ilike :email`, {
            email: `%${email}%`,
          });
        }

        const [list, total] = await queryBuilder.getManyAndCount();
        return {
          content: list.map(item => {
            const { userId, ...rest } = item;
            return { userid: userId, ...rest };
          }),
          pageable: {
            total,
            ...paging.pageable,
          },
        };
      } else{
        const queryBuilder = await this.dailyRepository
        .createQueryBuilder("daily")
        .take(paging.query.take)
        .skip(paging.query.skip)
        .orderBy("id", paging.query.sort as any);

        if (email) {
          queryBuilder.andWhere(`"email" ilike :email`, {
            email: `%${email}%`,
          });
        }
        if(query.from && query.to){
          if (filter === "All") {
            queryBuilder.andWhere(`"createdAt" >= :gtecreatedAt AND "createdAt" < :ltecreatedAt`, {
              gtecreatedAt: query.from,
              ltecreatedAt: query.to,
            });
          } else if (filter === "Early") {
            queryBuilder.andWhere(`"createdAt" >= :gtecreatedAt AND "createdAt" <= :ltecreatedAt`, {
              gtecreatedAt: query.from,
              ltecreatedAt: Number(query.from) + 27000000,
            });
          } else if (filter === "Late") {
            queryBuilder.andWhere(`"createdAt" >= :gtecreatedAt AND "createdAt" < :ltecreatedAt`, {
              gtecreatedAt: Number(query.from) + 27000000,
              ltecreatedAt: Number(query.from) + 61200000,
            });
          } 
        }
        const [list, total] = await queryBuilder.getManyAndCount();

        const result = await this.getNameChannelService.getNameChannel(list, client, "channelid");
        return {
          content: result,
          pageable: {
            total,
            ...paging.pageable,
          },
        };
      }
    }
  }
}
