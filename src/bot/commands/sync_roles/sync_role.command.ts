import { InjectRepository } from "@nestjs/typeorm";
import { Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { User } from "src/bot/models/user.entity";
import { UpdateRole } from "src/bot/utils/roles.utils";
import { Repository } from "typeorm";

@CommandLine({
  name: "sync",
  description: "WFH Daily",
  cat: "komu",
})
export class Sync_role implements CommandLineClass {
  constructor(
    private updateRole: UpdateRole
  ) {}
  async execute(message: Message, args, client: Client) {
    try {
      if (args[0] === "role") {
        await this.updateRole.updateRoleProject(client);
        return message.reply("Update role success!!!");
      }
    } catch (err) {
      console.log(err);
    }
  }
}
