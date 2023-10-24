import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "discord.js";
import { Penalty } from "src/bot/models/penatly.entity";
import { Paging } from "src/bot/utils/commonDto";
import { formatPaging } from "src/bot/utils/formatter";
import { GetNameChannelService } from "src/bot/utils/getFullNameChannel/getFullNameChannel.service";
import { Repository } from "typeorm";
import { getListPenalty } from "./dto/penalty.dto";

@Injectable()
export class PenaltyService {
  constructor(
    private getNameChannelService: GetNameChannelService,
    @InjectRepository(Penalty)
    private penaltyRepository: Repository<Penalty>
  ) {}

  async findAll(
    query: getListPenalty,
    client: Client
  ): Promise<Paging<Penalty>> {
    const { username, amountStart, amountEnd, from, to, isReject, page, size } =
      query;

    const paging = formatPaging(page, size);

    const queryBuilder = await this.penaltyRepository
      .createQueryBuilder("penalty")
      .take(paging.query.take)
      .skip(paging.query.skip)
      .orderBy("penalty.username", paging.query.sort as any);

    if (username) {
      queryBuilder.andWhere(`"username" ilike :username`, {
        username: `%${username}%`,
      });
    }

    if (amountStart) {
      queryBuilder.andWhere(`"ammount" >= :gteamount`, {
        gteamount: +query.amountStart,
      });
    }

    if (amountEnd) {
      queryBuilder.andWhere(`"ammount" <= :lteamount`, {
        lteamount: +query.amountEnd,
      });
    }

    if (from) {
      queryBuilder.andWhere(`"createdTimestamp" >= :gtecreatedTimestamp`, {
        gtecreatedTimestamp: query.from,
      });
    }

    if (to) {
      queryBuilder.andWhere(`"createdTimestamp" <= :ltecreatedTimestamp`, {
        ltecreatedTimestamp: query.to,
      });
    }

    if (isReject) {
      queryBuilder.andWhere('"isReject" = :isReject', {
        isReject: isReject,
      });
    }

    const [list, total] = await queryBuilder.getManyAndCount();

    const result = await this.getNameChannelService.getNameChannel(list, client, 'channelId');

    return {
      content: result,
      pageable: {
        total,
        ...paging.pageable,
      },
    };
  }

  async getAmountPenalty() {
    try {
      const queryBuilder = this.penaltyRepository.createQueryBuilder("penalty");
      queryBuilder.select(["MIN(ammount)", "MAX(ammount)"]);
      const amout = await queryBuilder.getRawOne();
      let result;
      if (amout.min === amout.max) {
        result = { min: 0, max: amout.max };
      } else {
        result = { min: amout.min, max: amout.max };
      }
      return { content: result };
    } catch (error) {
      console.log(error);
    }
  }
}
