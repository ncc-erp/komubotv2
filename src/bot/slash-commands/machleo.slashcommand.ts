import { SlashCommandPipe } from "@discord-nestjs/common";
import {
  Command,
  Handler,
  InjectDiscordClient,
  InteractionEvent,
} from "@discord-nestjs/core";
import { Client, TextChannel } from "discord.js";
import { ClientConfigService } from "../config/client-config.service";
import { MachleoDto } from "./dto/machleo.dto";
import { CommandSlash } from "../base/slashCommand.base";

@Command({
  name: "machleo",
  description: "Thích machleo",
})
@CommandSlash({
  name: "machleo",
  description: "Thích machleo",
})
export class MachleoSlashCommand {
  constructor(
    @InjectDiscordClient()
    private client: Client,
    private clientConfig: ClientConfigService
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: MachleoDto
  ): Promise<any> {
    try {
      const machleomsg = dto.message;
      (
        (await this.client.channels.cache.get(
          this.clientConfig.machleoChannelId
        )) as TextChannel
      )
        .send(machleomsg)
        .catch(console.error);

      return {
        content: "`✅` Message sent to #machleo.",
        ephemeral: true,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
