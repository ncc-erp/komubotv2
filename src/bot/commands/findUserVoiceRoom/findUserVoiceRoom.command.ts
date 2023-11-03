import { ChannelType, Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { FindUserVoiceRoomService } from "./findUserVoiceRoom.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { ClientConfigService } from "src/bot/config/client-config.service";

@CommandLine({
  name: "where",
  description: "Find User Voice Room",
  cat: "komu",
})
export class FindUserVoiceRoomCommand implements CommandLineClass {
  constructor(
    private readonly findUserVoiceRoomService: FindUserVoiceRoomService,
    private komubotrestService: KomubotrestService,
    private configClient: ClientConfigService
  ) {}
  async execute(message: Message, args, client: Client) {
    try {
      if (args[0]) {
        const emailUser = args[0];
        let authorId = message.author.id;
        const user = await this.findUserVoiceRoomService.getDataUser(emailUser);

        const guild = await client.guilds.fetch(
          this.configClient.guild_komu_id
        );
        if (!user)
          return message.reply(`Wrong Email!`).catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
        const member = await guild.members.fetch(user.userId);
        if (
          member.voice.channel &&
          member.voice.channel.type === ChannelType.GuildVoice
        ) {
          const rooms = member.voice.channel.id;
          let userMentions = await client.users.fetch(user.userId);
          let author = await client.users.fetch(authorId);

          await this.findUserVoiceRoomService.sendLinkToJoinCall(
            userMentions,
            author,
            rooms
          );
        } else {
          return message
            .reply(`The user is not currently participating in the voice room!`)
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
