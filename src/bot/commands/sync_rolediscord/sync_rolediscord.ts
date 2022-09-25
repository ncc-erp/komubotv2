import { InjectRepository } from "@nestjs/typeorm";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { User } from "src/bot/models/user.entity";
import { UpdateRole } from "src/bot/utils/roles.utils";
import { Repository } from "typeorm";

@CommandLine({
  name: "sync_role_discord",
  description: "WFH Daily",
})
export class Sync_roleDiscord implements CommandLineClass {
  constructor(
    @InjectRepository(User)
    private remindRepository: Repository<User>,
    private updateRole: UpdateRole
  ) {}
  async execute(message, args, client) {
    try {
      if (args[0] === "role") {
        await this.updateRole.updateRoleDiscord(client);
        return message.reply("Update role success!!!");
      }
    } catch (err) {
      console.log(err);
    }
  }
}
