import { InjectRepository } from "@nestjs/typeorm";
import { Message, Client, EmbedBuilder } from "discord.js";
import { DataSource, Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../base/command.base";

import { Channel } from "../models/channel.entity";
import { Msg } from "../models/msg.entity";

interface IChannel {
  komu_Channel_id: number;
  komu_Channel_name: string;
  komu_Channel_type: string;
  komu_Channel_nsfw: Boolean;
  komu_Channel_rawPosition: number;
  komu_Channel_lastMessageId: string;
  komu_Channel_rateLimitPerUser: number;
  komu_Channel_nsparentIdfw: string;
}

interface IMsg {
  komu_msg_id: number;
  komu_msg_channelId: string;
  komu_msg_guildId: string;
  komu_msg_deleted: Boolean;
  komu_msg_createdTimestamp: Date;
  komu_msg_type: string;
  komu_msg_system: Boolean;
  komu_msg_content: string;
  komu_msg_author: string;
  komu_msg_pinned: Boolean;
  komu_msg_tts: Boolean;
  komu_msg_nonce: string;
  komu_msg_embeds: string[];
  komu_msg_components: string[];
  komu_msg_attachments: string[];
  komu_msg_stickers: string[];
  komu_msg_editedTimestamp: Date;
  komu_msg_reactions: string[];
  komu_msg_mentions: string[];
  komu_msg_webhookId: string;
  komu_msg_groupActivityApplication: string;
  komu_msg_applicationId: string;
  komu_msg_activity: string;
  komu_msg_flags: number;
  komu_msg_reference: string;
  komu_msg_interaction: string;
}

@CommandLine({
  name: "channel",
  description: "channel",
})
export default class ChannelCommand implements CommandLineClass {
  constructor(
   
  ) {}
  async execute(message: Message, args, client, _, __, dataSource: DataSource) {
    const leaveData = dataSource.getRepository(Channel);

    try {
      const CATEGORY_ACHIEVED_CHANNEL_ID = "994886940950265856";
      const TIME = 7 * 24 * 60 * 60 * 1000;

      const channels = await Channel.find({
        parentId: { $ne: CATEGORY_ACHIEVED_CHANNEL_ID, $exists: true },
        type: { $nin: ["GUILD_CATEGORY"] },
      });
      let channelIds = channels.map((channel) => channel.id);

      for (channelIds of channelIds) {
        try {
          const channel = await client.channels.fetch(channelIds);
          const message = await channel.messages.fetch({ limit: 1 });
          const messageId = message.map((mes) => mes.id)[0];

          if (!messageId) continue;

          const messData = await Msg.apply({ id: messageId }).select(
            "-_id createdTimestamp"
          );

          if (Date.now() - messData.createdTimestamp >= TIME) {
            channel.setParent(CATEGORY_ACHIEVED_CHANNEL_ID);
            Channel.updateOne({
              $set: { parentId: CATEGORY_ACHIEVED_CHANNEL_ID },
            });
          }
        } catch (error) {
          continue;
        }
      }
      await _.reply("move channel successfully");
    } catch (error) {
      console.log(error);
    }
  }
}
