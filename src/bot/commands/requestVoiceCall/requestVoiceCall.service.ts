import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelType, Client, User as UserDiscord } from "discord.js";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { User } from "src/bot/models/user.entity";
import { VoiceChannels } from "src/bot/models/voiceChannel.entity";
import { Repository } from "typeorm";

@Injectable()
export class RequestVoiceCallService {
  constructor(
    @InjectRepository(VoiceChannels)
    private voiceChannelRepository: Repository<VoiceChannels>,
    private configClient: ClientConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getDataUser(email) {
    return await this.userRepository
      .createQueryBuilder()
      .where(`"email" = :email`, { email: email })
      .orWhere(`"username" = :username`, { username: email })
      .select("*")
      .getRawOne();
  }

  async getAllVoiceChannel(client: Client) {
    client.guilds.fetch(this.configClient.guild_komu_id);
    const voiceChannelBusy = await this.findVoiceChannelBusy();

    const getAllVoice = client.channels.cache.filter(
      (channel) =>
        channel.type === ChannelType.GuildVoice &&
        channel.parentId === this.configClient.guildvoice_parent_id &&
        channel.members.size === 0 &&
        !voiceChannelBusy.includes(channel.id)
    );

    return getAllVoice.map((item) => item.id);
  }

  async findVoiceChannelBusy() {
    const voices = await this.voiceChannelRepository.find({
      where: {
        status: "start",
      },
    });

    return voices.map((item) => item.voiceChannelId);
  }

  getVoiceChannelLink(
    voiceChannel: String,
    userMentions: UserDiscord,
    author: UserDiscord
  ) {
    const guildChannel = this.configClient.guild_komu_id;
    return (
      `Komu is connecting the call between ${userMentions.username} and ${author.username}` +
      "\n" +
      `https://discord.com/channels/${guildChannel}/${voiceChannel}`
    );
  }

  async sendLinkToJoinCall(
    userMentions: UserDiscord,
    author: UserDiscord,
    roomId: string
  ) {
    const link = this.getVoiceChannelLink(roomId, userMentions, author);
    await userMentions.send(link);
    await author.send(link);
  }
}
