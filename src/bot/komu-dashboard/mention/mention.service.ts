import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Mentioned } from "src/bot/models/mentioned.entity";
import { formatPaging } from "src/bot/utils/formatter";
import { Repository } from "typeorm";
import { Client } from 'discord.js';
import {getListMention} from "./dto/mention.dto";
import { User } from "src/bot/models/user.entity";
import { Paging } from "src/bot/utils/commonDto";

@Injectable()
export class MentionService {
  constructor(
    @InjectRepository(Mentioned)
    private mentionRepository: Repository<Mentioned>,
    
    @Inject('DiscordClient')
    private readonly client: Client,
  ) {
    this.client.login(process.env.TOKEN);
  }

  async getAll(query: getListMention) {
    const { from, to, page, size, sort, type, name } = query;
    const paging = formatPaging(page, size, sort);
    const queryBuilder = await this.mentionRepository
      .createQueryBuilder('mention')
      .leftJoinAndSelect(User, 'author', 'author.userId = mention.authorId')
      .leftJoinAndSelect(User, 'mentionUser', 'mentionUser.userId = mention.mentionUserId')
      .select([
          'mention.confirm',
          'author.username',
          'mentionUser.username',
          'mention.createdTimestamp',
          'mention.reactionTimestamp',
          'mention.punish',
          'mention.channelId',
          'mention.id',
      ])
      .limit(paging.query.take)
      .offset(paging.query.skip)
      .orderBy("mention.createdTimestamp", paging.query.sort as any);

    if (name) {
      queryBuilder.andWhere('author.username ilike :name OR mentionUser.username ilike :name', { name: `%${name}%` })
    }
    if (type) {
      queryBuilder.andWhere('mention.confirm =:confirm', { confirm: query.type })
    }

    if (from && to) {
      queryBuilder.andWhere(`mention.createdTimestamp >= :gtecreatedAt AND mention.createdTimestamp < :ltecreatedAt`, {
        gtecreatedAt: from,
        ltecreatedAt: to,
      });
    }
    const list = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();

    const listChange: any[] = []; 
    const guild = await this.client.guilds.fetch(process.env.GUILD_ID_WITH_COMMANDS);
    for (const item of list) {
      const channel = await guild.channels.fetch(item?.mention_channelId);
      listChange.push({
        id: item?.mention_id,
        author: item?.author_username,
        mention: item?.mentionUser_username,
        channel: channel?.name,
        time: item?.mention_createdTimestamp,
        confirm: item?.mention_confirm,
        punish:item?.mention_punish,
        reaction: item?.mention_reactionTimestamp,
      })
    }

    return {
      content: listChange,
      pageable: {
        total,
        ...paging.pageable,
      }
    }
  }
}
