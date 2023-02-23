import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Message, TextChannel } from "discord.js";
import { IndividualChannel } from "src/bot/models/individualChannel.entity";
import { Repository } from "typeorm";

@Injectable()
export class IndividualChannelService {
  constructor(
    @InjectRepository(IndividualChannel)
    private readonly individualChannelRepository: Repository<IndividualChannel>,
    private configService: ConfigService,
  ) { }

  async addUserToChannel(message: Message): Promise<boolean> {
    try {
      const userArgs = await message.mentions.members.first();
      return await (message.channel as TextChannel).permissionOverwrites.edit(userArgs, {
        SendMessages: true,
        ViewChannel: true
      })
        .then(() => true)
        .catch((e) => {
          console.log(e);
          return false
        });
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async removeUserFromChannel(message: Message): Promise<boolean> {
    try {
      const userArgs = await message.mentions.members.first();
      return await (message.channel as TextChannel).permissionOverwrites.edit(userArgs, {
        SendMessages: false,
        ViewChannel: false
      })
        .then(() => true)
        .catch(() => false);
    } catch (e) {
      return false;
    }
  }

  async createChannel(message: Message, channelName: string): Promise<boolean> {
    try {
      return await message.guild.channels.create({
        name: channelName,
      })
        .then(channel => {
          let category = message.guild.channels.cache.find(c => c.id == this.configService.get("INDIVIDUAL_CATEGORY_ID"));
          if (category) channel.setParent(category.id);
          (message.channel as TextChannel).permissionOverwrites.edit(message.author, {
            SendMessages: true,
            ViewChannel: true
          });
          this.individualChannelRepository.insert({
            channelId: channel.id,
            ownerUsername: message.author.username,
            ownerId: message.author.id,
            channelName: channelName
          });
          return true
        })
        .catch(e => {
          console.log(e);
          return false
        });
    } catch (e) {
      return false;
    }
  }

  async deleteChannel(message: Message, channelId: string): Promise<boolean> {
    try {
      const countOfChannel = await this.countOwnIndividualChannel(channelId, message.author.id, message.author.username);
      if (countOfChannel > 0) {
        const fetchedChannel = message.guild.channels.cache.get(channelId);
        return await fetchedChannel
          .delete()
          .then(() => true)
          .catch((e) => {
            console.log(e);
            return false;
          });
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async countOwnIndividualChannel(channelId: string, ownerId: string, ownerUsername: string): Promise<number> {
    try {
      return await this.individualChannelRepository
        .createQueryBuilder()
        .where(`"channelId" = :channelId`, {
          channelId: channelId,
        })
        .andWhere(`"ownerId" = :ownerId`, {
          ownerId: ownerId,
        })
        .andWhere(`"ownerUsername" = :ownerUsername`, {
          ownerUsername: ownerUsername,
        })
        .getCount();
    } catch (e) {
      return 0;
    }
  }
}
