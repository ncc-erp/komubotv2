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
  async handler(
    @Payload() dto: MachleoDto,
    { interaction }: TransformedCommandExecutionContext
  ) {
    try {
      console.log(process.env.KOMUBOTREST_MACHLEO_CHANNEL_ID,"sdfhkg");
      const machleomsg = dto.message;
      (
        (await this.client.channels.cache.get(
          '1020252263576502283'
        )) as any
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
