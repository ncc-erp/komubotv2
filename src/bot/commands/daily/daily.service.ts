import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message, TextChannel } from "discord.js";
import { TABLE } from "src/bot/constants/table";
import { Daily } from "src/bot/models/daily.entity";
import { Repository } from "typeorm";
@Injectable()
export class DailyService {
  constructor(
    @InjectRepository(Daily) private dailyRepository: Repository<Daily>
  ) {}

  async saveDaily(message: Message, args: string[], email: string) {
    await this.dailyRepository
      .createQueryBuilder(TABLE.DAILY)
      .insert()
      .into(Daily)
      .values({
        userid: message.author.id,
        email: email,
        daily: args.join(" "),
        createdAt: Date.now(),
        channelid: message.channel.id,
      })
      .execute();
  }

  hasPMRole(member) {
    const roles = member.roles.cache.map((role) => role.name);
    return roles.includes("PM");
  }

  async handleThreadChannel(message) {
    let hasPMRoleFlag = false;
    const thread = message.channel;
    const members = await thread.members.fetch();
    const filteredMembers = members.filter(
      (member) => member.user != null && !member.user.bot
    );
    const hasMoreThanTwoMembers = filteredMembers.size > 1;

    for (const threadMember of filteredMembers.values()) {
      const guildMember = await message.guild.members.fetch(threadMember.id);

      if (this.hasPMRole(guildMember)) {
        hasPMRoleFlag = true;
      }
    }

    if (hasMoreThanTwoMembers && hasPMRoleFlag) {
      return true;
    } else {
      return false;
    }
  }

  async handleTextChannel(message) {
    const channelMessage = message.channel;
    if (!(channelMessage instanceof TextChannel)) return false;

    const channelId = channelMessage.id;
    const guildId = channelMessage.guild.id;

    const guild = message.client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get(channelId);

    const members = channel.members.filter((member) => !member.user.bot);

    const hasMoreThanTwoMembers = members.size > 1;
    let hasPMRoleFlag = false;

    members.forEach((member) => {
      if (this.hasPMRole(member)) {
        hasPMRoleFlag = true;
        return;
      }
    });

    if (hasMoreThanTwoMembers && hasPMRoleFlag) {
      return true;
    } else return false;
  }
}
