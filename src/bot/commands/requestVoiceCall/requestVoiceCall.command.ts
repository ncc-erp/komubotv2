import { Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { RequestVoiceCallService } from "./requestVoiceCall.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";

@CommandLine({
  name: "call",
  description: "Request voice call",
  cat: "komu",
})
export class RequestVoiceCallCommand implements CommandLineClass {
  constructor(
    private readonly requestVoiceCallService: RequestVoiceCallService,
    private komubotrestService: KomubotrestService
  ) {}
  async execute(message: Message, args, client: Client) {
    try {
      if (args[0]) {
        const emailUser = args[0];
        let authorId = message.author.id;
        const user = await this.requestVoiceCallService.getDataUser(emailUser);

        if (!user)
          return message.reply(`Wrong Email!`).catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });

        const rooms = await this.requestVoiceCallService.getAllVoiceChannel(
          client
        );

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
