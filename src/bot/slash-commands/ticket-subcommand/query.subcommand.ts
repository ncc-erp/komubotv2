import { TransformPipe } from "@discord-nestjs/common";
import { DiscordCommand, SubCommand, UsePipes } from "@discord-nestjs/core";
import { CommandInteraction } from "discord.js";

@UsePipes(TransformPipe)
@SubCommand({ name: "query", description: "query is add|remove|list" })
export class QuerySubCommand implements DiscordCommand {
  handler(interaction: CommandInteraction) {
    const { options } = interaction;
    const topic = options.get("query").value;
    try {
    } catch (error) {
      console.log(error);
    }
  }
}
