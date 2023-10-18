import { ChannelType, Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { RequestVoiceCallService } from "./requestVoiceCall.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { ClientConfigService } from "src/bot/config/client-config.service";

@CommandLine({
  name: "call",
  description: "Request voice call",
  cat: "komu",
})
export class RequestVoiceCallCommand implements CommandLineClass {
  constructor(
    private readonly requestVoiceCallService: RequestVoiceCallService,
    private komubotrestService: KomubotrestService,
    private configClient: ClientConfigService,
  ) { }
  async execute(message: Message, args, client: Client) {
    try {
      if (args[0]) {
        const emailUser = args[0];
        let authorId = message.author.id;
        const user = await this.requestVoiceCallService.getDataUser(emailUser);
        let rooms;
        const guild = await client.guilds.fetch(this.configClient.guild_komu_id);
        const member = guild.members.cache.get(authorId);
        if (!user)
          return message.reply(`Wrong Email!`).catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
        if (member.voice.channel
          &&
          member.voice.channel.type === ChannelType.GuildVoice
        ) {
          rooms = [member.voice.channel.id];
        } else {
          rooms = await this.requestVoiceCallService.getAllVoiceChannel(
            client
          );
        }

        let userMentions = await client.users.fetch(user.userId);
        let author = await client.users.fetch(authorId);
        if (rooms.length > 0) {
          await this.requestVoiceCallService.sendLinkToJoinCall(
            userMentions,
            author,
            rooms[0]
          );
        } else {
          await author.send("voice channel full");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
