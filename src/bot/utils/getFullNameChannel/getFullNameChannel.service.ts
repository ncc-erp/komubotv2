import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelType, Client } from "discord.js";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class GetNameChannelService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getNameChannel(list: any, client: Client, id: string, email?: string) {
    try {
      let itemChannel;
      const promises = list.map(async (item) => {
        if (id == "channelid") {
          itemChannel = item.channelid;
        } else if (id == "channelId") {
          itemChannel = item.channelId;
        } else {
          itemChannel = item.id;
        }

        const fetchChannel = await client.channels
          .fetch(itemChannel)
          .catch((err) => {});

        if (email == "email" && item.authorId) {
          const userData = await this.getEmailUser(item.authorId);
          if (userData) {
            item = { ...item, email: userData.email };
          }
        }

        if(item?.userid){
          const userData = await this.getEmailUser(item?.userid);
          if (userData) {
            item = { ...item, avatar: userData.avatar };
          }
        }

        if (!fetchChannel) return item;
        const channelFullName = `${(fetchChannel as any).name}`;

        if (
          fetchChannel.type === ChannelType.GuildPublicThread ||
          fetchChannel.type === ChannelType.GuildPrivateThread
        ) {
          const channelParent = await client.channels
            .fetch(fetchChannel.parentId)
            .catch((err) => {});

          if (channelParent) {
            return {
              ...item,
              parentId: channelParent.id,
              parentName: (channelParent as any).name,
              channelFullName: `${channelFullName} (${
                (channelParent as any).name
              })`,
            };
          } else {
            return { ...item, channelFullName };
          }
        } else {
          return { ...item, channelFullName };
        }
      });
      return await Promise.all(promises);
    } catch (error) {}
  }

  async getEmailUser(userId: string) {
    return await this.userRepository.findOne({
      where: { userId: userId },
    });
  }
}
