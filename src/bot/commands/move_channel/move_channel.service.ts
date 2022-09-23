import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";

import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Channel } from "../../models/channel.entity";
import { Msg } from "../../models/msg.entity";
@Injectable()
export class MoveChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Msg)
    private msgRepository: Repository<Msg>
  ) {}
  async findChannels(CATEGORY_ACHIEVED_CHANNEL_ID) {
    return await this.channelRepository
      .createQueryBuilder(`${TABLE.CHANNEL}`)
      .where(`${TABLE.CHANNEL}.parentId = :parentId`, {
        parentId: !CATEGORY_ACHIEVED_CHANNEL_ID,
      })
      .andWhere(`${TABLE.CHANNEL}.type NOT IN (:types)`, {
        types: ["GUILD_CATEGORY"],
      })
      .getMany();
  }
  async fineOneMsg(messageId){
    return this.msgRepository
    .createQueryBuilder(`${TABLE.MSG}`)
    .select([`${TABLE.MSG}.id`, `${TABLE.MSG}.createdTimestamp`])
    .where(`${TABLE.MSG}.id = :id`, {id : messageId})
    .getOne();
  }
  async updateOneChannel(channelId, CATEGORY_ACHIEVED_CHANNEL_ID) {
    await this.channelRepository
      .createQueryBuilder()
      .update(`${TABLE.CHANNEL}`)
      .set({ parentId: CATEGORY_ACHIEVED_CHANNEL_ID })
      .where("id = :id", { id: channelId })
      .execute();
  }
}
