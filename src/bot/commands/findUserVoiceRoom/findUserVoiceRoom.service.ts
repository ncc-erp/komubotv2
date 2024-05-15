import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User as UserDiscord } from "discord.js";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class FindUserVoiceRoomService {
  constructor(
    private configClient: ClientConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getDataUser(param) {
    return await this.userRepository
      .createQueryBuilder()
      .where(`"email" = :email`, { email: param })
      .orWhere(`"username" = :username`, { username: param })
      .orWhere(`"userId" = :userId`, { userId: param })
      .select("*")
      .getRawOne();
  }

  getVoiceChannelLink(voiceChannel: String, userMentions: UserDiscord) {
    const guildChannel = this.configClient.guild_komu_id;
    return (
      `Komu is connecting the call with ${userMentions.username}` +
      "\n" +
      `https://discord.com/channels/${guildChannel}/${voiceChannel}`
    );
  }

  async sendLinkToJoinCall(
    userMentions: UserDiscord,
    author: UserDiscord,
    roomId: string
  ) {
    const link = this.getVoiceChannelLink(roomId, userMentions);
    await author.send(link);
  }
}
