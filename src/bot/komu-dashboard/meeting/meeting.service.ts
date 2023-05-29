import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "discord.js";
import { Meeting } from "src/bot/models/meeting.entity";
import { Paging } from "src/bot/utils/commonDto";
import { formatPaging } from "src/bot/utils/formatter";
import { GetNameChannelService } from "src/bot/utils/getFullNameChannel/getFullNameChannel.service";
import { Repository } from "typeorm";
import { getListMeeting } from "./dto/meeting.dto";

@Injectable()
export class MeetingService {
  constructor(
    private getNameChannelService: GetNameChannelService,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>
  ) {}

  async findAll(
    query: getListMeeting,
    client: Client
  ): Promise<Paging<Meeting>> {
    const { repeat, task, from, to, cancel, page, size, sort } = query;

    const paging = formatPaging(page, size, sort);

    const queryBuilder = await this.meetingRepository
      .createQueryBuilder("user")
      .take(paging.query.take)
      .skip(paging.query.skip)
      .orderBy("id", paging.query.sort as any);

    if (repeat) {
      queryBuilder.andWhere(`"repeat" = :repeat`, {
        repeat: repeat,
      });
    }

    if (task) {
      queryBuilder.andWhere(`"task" ilike :task`, {
        task: `%${task}%`,
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

    if (cancel) {
      queryBuilder.andWhere('"cancel" = :cancel', {
        cancel: cancel,
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
}
