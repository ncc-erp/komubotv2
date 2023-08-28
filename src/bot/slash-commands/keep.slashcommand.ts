import {
  Command,
  EventParams,
  Handler,
  InteractionEvent,
} from "@discord-nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientEvents, InteractionReplyOptions } from "discord.js";
import { Repository } from "typeorm";
import { KeepDto } from "./dto/keep.dto";
import { Keep } from "../models/keep.entity";
import { SlashCommandPipe } from "@discord-nestjs/common";

@Command({
  name: "keep",
  description: "manage yourself note",
})
export class KeepSlashCommand {
  constructor(
    @InjectRepository(Keep)
    private keepData: Repository<Keep>
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: KeepDto,
    @EventParams() args: ClientEvents['interactionCreate'],
  ): Promise<InteractionReplyOptions> {
    try {
      const interaction = args.at(0);
      await this.keepData.insert({
        userId: interaction.user.id,
        note: dto.note,
        start_time: Date.now(),
        status: "active",
      });
      return {
        content: "`✅` Note saved. Use `/wiki note` to list.",
        ephemeral: true,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
