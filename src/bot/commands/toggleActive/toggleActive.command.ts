import { InjectRepository } from "@nestjs/typeorm";
import { Message, EmbedBuilder } from "discord.js";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../../base/command.base";

@CommandLine({
  name: "toggleactivation",
  description: "Toggle Activation",
})
export class ToggleActiveCommand implements CommandLineClass {
  constructor(
    @InjectRepository(User)
    private userData: Repository<User>
  ) {}

  async execute(message: Message, args) {
    try {
      let authorId = args[0];
      const findUserId = await this.userData.find({
        where: [{ userId: authorId }, { username: authorId }],
      });
      console.log(findUserId);
    } catch (error) {}
  }
}
