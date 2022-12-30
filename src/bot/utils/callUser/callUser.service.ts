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

  async callUser(message: Message, args, client: Client) {
    try {
      if (args[0] && message.mentions.members.first() && !args[1]) {
        const mentionUserId = message.mentions.members.first();
        let includeChannel = false;
        let getChannels: any = await message.client.channels
          .fetch(message.channelId)
          .catch((err) => console.log(err, "err"));
        if (
          getChannels.type === ChannelType.GuildPublicThread ||
          getChannels.type === ChannelType.GuildPrivateThread
        ) {
          getChannels = await message.client.channels.fetch(
            getChannels.parentId
          );
        }

        if (getChannels && getChannels.members && getChannels.members.some) {
          includeChannel = getChannels.members.some(
            (member) => member.id === mentionUserId.user.id
          );
        }

        if (!includeChannel) {
          return message
            .reply({
              content: "This user is not have in channel",
            })
            .catch((err) => {
              console.log(err);
            });
        }

        const authorId = message.author.id;
        const users = await this.userRepository
          .createQueryBuilder()
          .where('("roles" @> :pm)', {
            pm: ["PM"],
          })
          .andWhere(`"userId" = :userId`, {
            userId: authorId,
          })
          .andWhere(`"deactive" IS NOT TRUE`)
          .select("*")
          .execute();

        if (
          users.length > 0 ||
          authorId == "922148445626716182" ||
          authorId == "764877775068594177"
        ) {
          try {
            const userMention = await this.userRepository
              .createQueryBuilder()
              .where(`"userId" = :userId`, {
                userId: mentionUserId.user.id,
              })
              .andWhere(`"deactive" IS NOT TRUE`)
              .select("*")
              .execute();

            if (userMention.length == 0)
              return await message
                .reply({
                  content: "User does not exist",
                })
                .catch((err) => {
                  console.log(err);
                });

            const { data } = await firstValueFrom(
              this.http
                .get(
                  `${this.clientConfigService.phonenumber.api_url}${userMention[0].email}@ncc.asia`,
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

            if (!data || !data.result) {
              return await message
                .reply({
                  content: "Can't find phone number",
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            const messageReply = await message
              .reply({
                content: "I'm calling",
              })
              .catch((err) => {
                console.log(err);
              });
            try {
              await firstValueFrom(
                this.http
                  .post(this.clientConfigService.sendSms, {
                    tel: data.result.phoneNumber,
                    timeout: 20,
                  })
                  .pipe((res) => res)
              );
              await (messageReply as Message).edit("Done").catch((err) => {
                console.log(err);
              });
            } catch (error) {
              await (messageReply as Message).edit("I'm busy").catch((err) => {
                console.log(err);
              });
              return { data: "There was an error!" };
            }
          } catch (error) {}
        } else {
          await message
            .reply({
              content: "Missing permissions",
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        await message
          .reply({
            content: messHelp,
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {}
  }
}
