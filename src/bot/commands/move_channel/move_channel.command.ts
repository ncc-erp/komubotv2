import { EmbedBuilder, Message } from "discord.js";
import { DataSource } from "typeorm";
import { CommandLine, CommandLineClass } from "../../base/command.base";

import { MoveChannelService } from "./move_channel.service";


@CommandLine({
  name: "channel",
  description: "channel",
})
export class MoveChannelCommand implements CommandLineClass {
  constructor(
   private movelChannelService : MoveChannelService,
  ) {}
  async execute(message: Message, args, client, _, __, dataSource: DataSource) {
    try {
      console.log('have anyone')
      const CATEGORY_ACHIEVED_CHANNEL_ID = "994886940950265856";
      const TIME = 7 * 24 * 60 * 60 * 1000;
      if(args[0]  === 'have anyone here?'){
        const Embed = new EmbedBuilder()
                .setTitle(`Co cai d...`)
                .setColor(0xed4245)
                .setDescription(``);
        await message.reply({ embeds: [Embed] }).catch((err) => {
          
        });
      }

      const channels = await this.movelChannelService.findChannels(CATEGORY_ACHIEVED_CHANNEL_ID)
      let channelIds = channels.map((channel) => channel.id);

      for (let channelId of channelIds) {
        try {
          const channel = await client.channels.fetch(channelIds);
          const message = await channel.messages.fetch({ limit: 1 });
          const messageId = message.map((mes) => mes.id)[0];

          if (!messageId) continue;

          const messData = await this.movelChannelService.fineOneMsg(messageId)

          // if (Date.now() - messData.createdTimestamp.getTime() >= TIME) {
          //   channel.setParent(CATEGORY_ACHIEVED_CHANNEL_ID);
          //   this.movelChannelService.updateOneChannel(channelId, CATEGORY_ACHIEVED_CHANNEL_ID)
          // }
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
