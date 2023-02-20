import { ChannelType, Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { RenameChannelService } from "./renameChannel.service";

@CommandLine({
  name: "rename",
  description: "renameChannel message",
  cat: "komu",
})
export class RenameChannelCommand implements CommandLineClass {
  constructor(
    private renameChannelService: RenameChannelService,
    private komubotrestService: KomubotrestService,
    private clientConfig: ClientConfigService
  ) {}
  async execute(message: Message, args, client: Client) {
    try {
      const authorId = message.author.id;
      if (authorId !== this.clientConfig.user_daitrinh_id) {
        return message
          .reply({
            content:
              "```You do not have permission to execute this command!```",
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      }

      const guildChannel = await client.guilds.fetch(
        this.clientConfig.guild_komu_id
      );

      const channels = await guildChannel.channels.fetch();
      channels.map(async (c) => {
        if (c.type === ChannelType.GuildText) {
          await this.renameChannelService.renameChannel(c, client);
        }
      });

      const threads = guildChannel.channels.cache.filter((x) => x.isThread());

      threads.map(async (c) => {
        if (
          c.type === ChannelType.GuildPublicThread ||
          c.type === ChannelType.GuildPrivateThread
        ) {
          await this.renameChannelService.renameChannel(c, client);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
