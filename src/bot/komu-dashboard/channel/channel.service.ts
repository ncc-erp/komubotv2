import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelType, Client } from "discord.js";
import { Channel } from "src/bot/models/channel.entity";
import { Paging } from "src/bot/utils/commonDto";
import { formatPaging } from "src/bot/utils/formatter";
import { GetNameChannelService } from "src/bot/utils/getFullNameChannel/getFullNameChannel.service";
import { Repository } from "typeorm";
import { getListChannel } from "./dto/channel.dto";

@Injectable()
export class ChannelService {
  constructor(
    private getNameChannelService: GetNameChannelService,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>
  ) {}

  async findAll(
    query: getListChannel,
    client: Client
  ): Promise<Paging<Channel>> {
    const { name, type, page, size } = query;

    const paging = formatPaging(page, size);

    const queryBuilder = await this.channelRepository
      .createQueryBuilder("user")
      .take(paging.query.take)
      .skip(paging.query.skip);

    if (name) {
      queryBuilder.andWhere(`"name" ilike :name`, {
        name: `%${name}%`,
      });
    }

    if (type) {
      queryBuilder.andWhere('"type" = :type', {
        type: type,
      });
    }

    const [list, total] = await queryBuilder.getManyAndCount();
    const resultTypeChannel = await this.getTypeChannel(list);

    const result = await this.getNameChannelService.getNameChannel(
      resultTypeChannel,
      client,
      "id"
    );

    return {
      content: result,
      pageable: {
        total,
        ...paging.pageable,
      },
    };
  }

  async getTypeChannel(list: any) {
    try {
      const promises = list.map(async (item) => {
        if (item.type == ChannelType.GuildPublicThread) {
          return {
            ...item,
            type: "GUILD_PUBLIC_THREAD",
          };
        } else if (item.type == ChannelType.GuildPrivateThread) {
          return { ...item, type: "GUILD_PRIVATE_THREAD" };
        } else if (item.type == ChannelType.GuildText) {
          return { ...item, type: "GUILD_TEXT" };
        } else if (item.type == ChannelType.DM) {
          return { ...item, type: "DM" };
        } else {
          return item;
        }
      });

      return await Promise.all(promises);
    } catch (error) {}
  }
}
