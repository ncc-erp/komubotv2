import { Command, DiscordCommand } from "@discord-nestjs/core";
import {
  ApplicationCommandType,
  ContextMenuCommandInteraction,
} from "discord.js";

@Command({
  name: "playlist",
  type: ApplicationCommandType.User,
})
export class PlaylistSlashCommand implements DiscordCommand {
  handler(interaction): string {
    // ContextMenuCommandInteraction
    return "Your playlist...";
  }
}
