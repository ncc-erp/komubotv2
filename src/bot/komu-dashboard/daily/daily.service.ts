import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "discord.js";
import { Daily } from "src/bot/models/daily.entity";
import { formatPaging } from "src/bot/utils/formatter";
import { GetNameChannelService } from "src/bot/utils/getFullNameChannel/getFullNameChannel.service";
import { Repository } from "typeorm";
import { getListDaily } from "./dto/daily.dto";

@Injectable()
export class DailyService {
  constructor(
    private getNameChannelService: GetNameChannelService,
    @InjectRepository(Daily)
    private dailyRepository: Repository<Daily>
  ) {}

  async reportDaily(query: getListDaily, client: Client): Promise<any> {
    const { email, from, to, page, size, sort } = query;

    const paging = formatPaging(page, size, sort);

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

    if (from) {
      queryBuilder.andWhere(`"createdAt" >= :gtecreatedAt`, {
        gtecreatedAt: query.from,
      });
    }

    if (to) {
      queryBuilder.andWhere(`"createdAt" <= :ltecreatedAt`, {
        ltecreatedAt: query.to,
      });
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
