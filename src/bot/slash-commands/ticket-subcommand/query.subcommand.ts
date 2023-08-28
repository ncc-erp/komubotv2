import { Handler, SubCommand } from "@discord-nestjs/core";
import { CommandInteraction } from "discord.js";

@SubCommand({ name: "query", description: "query is add|remove|list" })
export class QuerySubCommand {
  @Handler()
  handler(interaction: CommandInteraction) {
    const { options } = interaction;
    const topic = options.get("query").value;
    try {
    } catch (error) {
      console.log(error);
    }
  }
}
