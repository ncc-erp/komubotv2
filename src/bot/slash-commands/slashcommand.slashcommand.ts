import {
  Command,
  EventParams,
  Handler,
  InteractionEvent,
} from "@discord-nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientEvents, InteractionReplyOptions } from "discord.js";
import { Repository } from "typeorm";
import { SlashCommandPipe } from "@discord-nestjs/common";
import { Dynamic } from "../models/dynamic.entity";
import { CommandSlash } from "../base/slashCommand.base";
import { DynamicDto } from "./dto/dynamic.dto";

@Command({
  name: "register",
  description: "Create command emoji",
})
@CommandSlash({
  name: "register",
  description: "Create command emoji",
})
export class DynamicSlashCommand {
  constructor(
    @InjectRepository(Dynamic)
    private dynamicData: Repository<Dynamic>
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: DynamicDto,
    @EventParams() args: ClientEvents["interactionCreate"]
  ): Promise<InteractionReplyOptions> {
    try {
      const interaction = args[0];
      const command = await this.dynamicData.findOneBy({
        command: dto.command,
      });
      if (command) {
        return {
          content:
            "``` ❌ The command cannot be saved because it already exists.```",
          ephemeral: true,
        };
      }
      await this.dynamicData.insert({
        userId: interaction.user.id,
        command: dto.command,
        output: dto.output,
      });
      return {
        content: "``` ✅ Dynamic saved.```",
        ephemeral: true,
      };
    } catch (error) {
      console.error(error);
      return {
        content: "``` ❌ Failed to save dynamic command.```",
        ephemeral: true,
      };
    }
  }
}
