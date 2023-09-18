import { SlashCommandPipe } from "@discord-nestjs/common";
import {
  Command,
  EventParams,
  Handler,
  InjectDiscordClient,
  InteractionEvent,
} from "@discord-nestjs/core";
import { Client, ClientEvents, Message } from "discord.js";
import { CallDto } from "./dto/call.dto";
import { RequestVoiceCallService } from "../commands/requestVoiceCall/requestVoiceCall.service";

@Command({
  name: "call",
  description: "call username",
})
export class CallSlashCommand {
  constructor(
    @InjectDiscordClient()
    private client: Client,
    private readonly requestVoiceCallService: RequestVoiceCallService
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: CallDto,
    @EventParams() args: ClientEvents["interactionCreate"]
  ): Promise<any> {
    try {
      const interaction = args.at(0);
      const authorId = interaction.user.id;
      const user = await this.requestVoiceCallService.getDataUser(dto.username);
      if (!user)
        return {
          content: "Wrong Email",
        };
      const rooms = await this.requestVoiceCallService.getAllVoiceChannel(
        this.client
      );
      let userMentions = await this.client.users.fetch(user.userId);
      let author = await this.client.users.fetch(authorId);
      if (rooms.length > 0) {
        await this.requestVoiceCallService.sendLinkToJoinCall(
          userMentions,
          author,
          rooms[0]
        );
      } else {
        await author.send("voice channel full");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
