import { InjectRepository } from "@nestjs/typeorm";
import { Message, EmbedBuilder } from "discord.js";
import { User } from "src/bot/models/user.entity";
import { sendErrorToDevTest } from "src/bot/utils/komubotrest.utils";
import { Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../../base/command.base";
import { ToggleActiveService } from "./toggleActive.service";

@CommandLine({
  name: "toggleactivation",
  description: "Toggle Activation",
})
export class ToggleActiveCommand implements CommandLineClass {
  constructor(
    @InjectRepository(User)
    private userData: Repository<User>,
    private toggleActiveService: ToggleActiveService
  ) {}
  messHelp =
    "```" +
    "*toggleactivation username" +
    "\n" +
    "*toggleactivation id" +
    "```";

  async execute(message: Message, args, client) {
    try {
      let authorId = args[0];
      let userId = args[0].slice(2, -1);
      const findUserId = await this.toggleActiveService.findAcc(
        userId,
        authorId
      );
      const allUsers = await this.userData.find();

      const correctUrers = allUsers.find(
        (item) => item.username === findUserId.username
      );

      if (findUserId === null)
        return message
          .reply({
            content: `${this.messHelp}`,
          })
          .catch((err) => {
            sendErrorToDevTest(client, authorId, err);
          });
      if (!correctUrers.deactive) {
        message
          .reply({
            content: "Disable account successfully",
          })
          .catch((err) => {
            sendErrorToDevTest(client, authorId, err);
          });

        await this.toggleActiveService.deactiveAcc(correctUrers.id);
      } else {
        await this.toggleActiveService.ActiveAcc(correctUrers.id);
        message
          .reply({
            content: "Enable account successfully",
          })
          .catch((err) => {
            sendErrorToDevTest(client, authorId, err);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
