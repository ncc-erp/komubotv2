import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { BWL } from "src/bot/models/bwl.entity";
import { Channel } from "src/bot/models/channel.entity";
import { Repository } from "typeorm";

@Injectable()
export class BWL_UtilsServices {
  constructor(
    @InjectRepository(BWL)
    private bwlRepository : Repository<BWL>,
    @InjectRepository(Channel)
    private channelRepository : Repository<Channel>
  ){}
    async addNewBWL(_channelId, _messageId, _guildId, _authorId, _links, _createTimestamp){
      await this.bwlRepository.createQueryBuilder()
      .insert().into(BWL)
      .values([
        {
          channelId : _channelId, 
          messageId : _messageId, 
          guildId : _guildId, 
          authorId : _authorId, 
          link : _links, 
          createTimestamp : _createTimestamp
        }
      ]).execute();
    }
    async addChannelData(_channelId, _name, _type, _nsfw, _rawPosition, _lastMessageId, _rateLimitPerUser){
      await this.channelRepository.createQueryBuilder()
      .insert().into(Channel)
       .values([
        {
          channelId : _channelId, 
          name : _name, 
          type : _type, 
          nsfw : _nsfw, 
          rawPosition : _rawPosition, 
          lastMessageId : _lastMessageId, 
          rateLimitPerUser : _rateLimitPerUser, 
        }
       ]).execute();
       return await this.channelRepository.createQueryBuilder(TABLE.CHANNEL)
       .where(`${TABLE.CHANNEL}.channelId = :channelID`, {channelId : _channelId})
       .execute();
    }
    async findDatachk(_channelId){
      return await this.channelRepository.createQueryBuilder(TABLE.CHANNEL)
      .where(`${TABLE.CHANNEL}.channelId =:channelId`, {channelId : _channelId})
      .execute();
    }
}