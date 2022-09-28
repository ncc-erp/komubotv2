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
import { Client, Message } from "discord.js";
import { send } from "process";
import { Repository } from "typeorm";
import { MachleoDto } from "../dto/machleo.dto";

@Command({
  name: "machleo",
  description: "Thích machleo",
})
@UsePipes(TransformPipe)
export class MachleoCommand implements DiscordTransformedCommand<MachleoDto> {
  constructor(
    @InjectDiscordClient()
    private client: Client
  ) {}
  handler(
    @Payload() dto: MachleoDto,
    { interaction }: TransformedCommandExecutionContext
  ): any {
    try {
      const machleomsg = dto.message;
      const channel = this.client.channels.fetch("1011577280956485643");
      interaction.reply({
        content: "`✅` Message sent to #macleo.",
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
