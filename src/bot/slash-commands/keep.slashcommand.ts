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
import { Message } from "discord.js";
import { Repository } from "typeorm";
import { KeepDto } from "./dto/keep.dto";
import { Keep } from "../models/keep.entity";

@Command({
  name: "keep",
  description: "manage yourself note",
})
@UsePipes(TransformPipe)
export class KeepSlashCommand implements DiscordTransformedCommand<KeepDto> {
  constructor(
    @InjectRepository(Keep)
    private keepData: Repository<Keep>
  ) {}

  async handler(
    @Payload() dto: KeepDto,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<any> {
    try {
      const note = interaction.options.get("note").value as string;
      await this.keepData.insert({
        userId: interaction.user.id,
        note: note,
        start_time: Date.now(),
        status: "active",
      });
      interaction.reply({
        content: "`✅` Note saved. Use `/wiki note` to list.",
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
