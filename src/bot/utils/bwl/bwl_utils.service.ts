import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { Bwl } from "src/bot/models/bwl.entity";
import { Channel } from "src/bot/models/channel.entity";
import { Repository } from "typeorm";

@Injectable()
export class BWL_UtilsServices {
  constructor(
    @InjectRepository(Bwl)
    private bwlRepository : Repository<Bwl>,
    @InjectRepository(Channel)
    private channelRepository : Repository<Channel>
  ){}
    async addNewBWL(_channelId, _messageId, _guildId, _authorId, _links, _createdTimestamp){
      await this.bwlRepository.createQueryBuilder()
      .insert().into(Bwl)
      .values([
        {
          channel : _channelId,
          messageId : _messageId, 
          guildId : _guildId, 
          link : _links, 
          createdTimestamp : _createdTimestamp, 
          author : _authorId
        }
      ]).execute();
    }
    async addChannelData(_channelId, _name, _type, _nsfw, _rawPosition, _lastMessageId, _rateLimitPerUser){
      await this.channelRepository.createQueryBuilder()
      .insert().into(Channel)
       .values([
        {
         id : _channelId, 
          name : _name, 
          type : _type, 
          nsfw : _nsfw, 
          rawPosition : _rawPosition, 
          lastMessageId : _lastMessageId, 
          rateLimitPerUser : _rateLimitPerUser, 
        }
       ]).execute();
       return await this.channelRepository.createQueryBuilder(TABLE.CHANNEL)
       .where(`${TABLE.CHANNEL}.id = :channelID`, {channelId : _channelId})
       .execute();
    }
    async findDatachk(_channelId){
      return await this.channelRepository.createQueryBuilder(TABLE.CHANNEL)
      .where(`${TABLE.CHANNEL}.id =:channelId`, {channelId : _channelId})
      .execute();
    }
}