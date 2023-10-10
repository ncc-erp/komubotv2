import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "discord.js";
import { Msg } from "src/bot/models/msg.entity";
import { Paging } from "src/bot/utils/commonDto";
import { formatPaging } from "src/bot/utils/formatter";
import { GetNameChannelService } from "src/bot/utils/getFullNameChannel/getFullNameChannel.service";
import { Repository } from "typeorm";
import { getListMessage } from "./dto/message.dto";

@Injectable()
export class MessageService {
  constructor(
    private getNameChannelService: GetNameChannelService,
    @InjectRepository(Msg)
    private msgRepository: Repository<Msg>
  ) {}
  async findAll(query: getListMessage, client: Client): Promise<Paging<Msg>> {
    //try {
      const { title, page, size, sort, from, to } = query;

      const paging = formatPaging(page, size, sort);

      const queryBuilder = await this.msgRepository
        .createQueryBuilder("msg")
        .innerJoin("komu_user", "w", "msg.authorId = w.userId")
        .offset(paging.query.skip)
        .limit(paging.query.take)
        .orderBy(`"msg"."createdTimestamp"`, paging.query.sort as any)
        .select("*");

      if (title) {
        queryBuilder.andWhere(`"content" ilike :title OR "email" ilike :title`, {
          title: `%${title}%`,
        });
      }

      if (from && to ) {
        queryBuilder.andWhere(`"createdAt" >= :gtecreatedAt AND "createdAt" < :ltecreatedAt`, {
          gtecreatedAt: Number(from),
          ltecreatedAt: Number(to),
        });
      }

      const result = await queryBuilder.getManyAndCount();
      const list = await queryBuilder.getRawMany();

      return {
        content: list,
        pageable: {
          total: result[1],
          ...paging.pageable,
        },
      };
    // } catch (error) {
    //   throw new UnauthorizedException(`Not Found`);
    // }
  }
}
