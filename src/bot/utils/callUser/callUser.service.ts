import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelType, Client, Message } from "discord.js";
import { firstValueFrom } from "rxjs";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";

const messHelp = "```" + "*bzz @username" + "```";

@Injectable()
export class CallUserService {
  constructor(
    private readonly http: HttpService,
    private clientConfigService: ClientConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async fetchUserChannels(message) {
    try {
      let channels = await message.client.channels.fetch(message.channelId);
      if (
        channels.type === ChannelType.GuildPublicThread ||
        channels.type === ChannelType.GuildPrivateThread
      ) {
        channels = await message.client.channels.fetch(channels.parentId);
      }
      return channels;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async isUserInChannel(channels, userId) {
    if (channels && channels.members && channels.members.some) {
      return channels.members.some((member) => member.id === userId);
    }
    return false;
  }

  async fetchActiveUsers(authorId) {
    return await this.userRepository
      .createQueryBuilder()
      .where('"roles" @> :pm', { pm: ["PM"] })
      .andWhere('"userId" = :userId', { userId: authorId })
      .andWhere('"deactive" IS NOT TRUE')
      .select("*")
      .execute();
  }

  async fetchUserMention(userRepository, userId) {
    return await userRepository
      .createQueryBuilder()
      .where('"userId" = :userId', { userId })
      .andWhere('"deactive" IS NOT TRUE')
      .select("*")
      .execute();
  }

  async fetchPhoneNumber(email) {
    try {
      const { data } = await firstValueFrom(
        this.http
          .get(
            `${this.clientConfigService.phonenumber.api_url}${email}@ncc.asia`,
            {
              headers: {
                "X-Secret-Key": this.clientConfigService.hrmApiKey,
              },
            }
          )
          .pipe((res) => res)
      ).catch((err) => {
        console.log("Error ", err);
        return { data: "There was an error!" };
      });
      return data;
    } catch (error) {
      console.log("Error ", error);
      return null;
    }
  }

  async sendSms(http, apiUrl, phoneNumber) {
    try {
      await firstValueFrom(
        http.post(apiUrl, {
          tel: phoneNumber,
          timeout: 20,
        })
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async callUser(message: Message, args, client: Client) {
    try {
      if (args[0] && message.mentions.members.first() && !args[1]) {
        const mentionUserId = message.mentions.members.first();
        const channels = await this.fetchUserChannels(message);

        if (!channels) {
          return;
        }

        const includeChannel = await this.isUserInChannel(
          channels,
          mentionUserId.user.id
        );

        if (!includeChannel) {
          await message.reply({ content: "This user is not in the channel" });
          return;
        }

        const authorId = message.author.id;
        const users = await this.fetchActiveUsers(authorId);

        if (users.length > 0 || authorId == "922148445626716182") {
          const userMention = await this.fetchUserMention(
            this.userRepository,
            mentionUserId.user.id
          );

          if (userMention.length === 0) {
            await message.reply({ content: "User does not exist" });
            return;
          }

          const data = await this.fetchPhoneNumber(userMention[0].email);

          if (!data || !data.result) {
            await message.reply({ content: "Can't find phone number" });
            return;
          }

          const messageReply = await message.reply({ content: "I'm calling" });

          const smsSent = await this.sendSms(
            this.http,
            this.clientConfigService.sendSms,
            data.result.phoneNumber
          );

          if (smsSent) {
            await messageReply.edit("Done");
          } else {
            await messageReply.edit("I'm busy");
          }
        } else {
          await message.reply({ content: "Missing permissions" });
        }
      } else {
        await message.reply({ content: messHelp });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
