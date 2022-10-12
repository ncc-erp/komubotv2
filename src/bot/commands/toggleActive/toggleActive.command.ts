import { InjectRepository } from "@nestjs/typeorm";
import { Message, EmbedBuilder, Client } from "discord.js";
import { User } from "src/bot/models/user.entity";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../../base/command.base";
import { ToggleActiveService } from "./toggleActive.service";

@CommandLine({
  name: "toggleactivation",
  description: "Toggle Activation",
  cat: "komu",
})
export class ToggleActiveCommand implements CommandLineClass {
  constructor(
    @InjectRepository(User)
    private userData: Repository<User>,
    private toggleActiveService: ToggleActiveService,
    private komubotrestService: KomubotrestService
  ) {}
  messHelp =
    "```" +
    "*toggleactivation username" +
    "\n" +
    "*toggleactivation id" +
    "```";

  async execute(message: Message, args, client: Client) {
    try {
      let authorId = args[0];
      const findUserId = await this.toggleActiveService.findAcc(authorId);

      if (findUserId === null)
        return message
          .reply({
            content: `${this.messHelp}`,
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      if (!findUserId.deactive) {
        message
          .reply({
            content: "Disable account successfully",
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });

        await this.toggleActiveService.deactiveAcc(findUserId.userId);
      } else {
        await this.toggleActiveService.ActiveAcc(findUserId.userId);
        message
          .reply({
            content: "Enable account successfully",
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
