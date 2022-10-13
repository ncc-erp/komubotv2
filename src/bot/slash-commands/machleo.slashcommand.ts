import { TransformPipe } from "@discord-nestjs/common";
import {
  Command,
  DiscordTransformedCommand,
  InjectDiscordClient,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from "@discord-nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, Message, TextChannel } from "discord.js";
import { send } from "process";
import { Repository } from "typeorm";
import { ClientConfigService } from "../config/client-config.service";
import { MachleoDto } from "./dto/machleo.dto";

@Command({
  name: "machleo",
  description: "Thích machleo",
})
@UsePipes(TransformPipe)
export class MachleoSlashCommand
  implements DiscordTransformedCommand<MachleoDto>
{
  constructor(
    @InjectDiscordClient()
    private client: Client,
    private clientConfig: ClientConfigService
  ) {}
  async handler(
    @Payload() dto: MachleoDto,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<any> {
    try {
      const machleomsg = interaction.options.get("message").value as string;
      (
        (await this.client.channels.cache.get(
          this.clientConfig.machleoChannelId
        )) as TextChannel
      )
        .send(machleomsg)
        .catch(console.error);

      interaction.reply({
        content: "`✅` Message sent to #macleo.",
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
}