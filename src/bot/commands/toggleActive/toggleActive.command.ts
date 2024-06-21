import { InjectRepository } from "@nestjs/typeorm";
import { Message, EmbedBuilder, Client } from "discord.js";
import { User } from "src/bot/models/user.entity";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../../base/command.base";
import { ToggleActiveService } from "./toggleActive.service";
import { NotifiService } from "../notification/noti.service";

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
    private komubotrestService: KomubotrestService,
    private notifiService: NotifiService
  ) {}
  messHelp =
    "```" +
    "*toggleactivation username" +
    "\n" +
    "*toggleactivation id" +
    "```";

  async execute(message: Message, args, client: Client) {
    try {
      if (args[0] === "check") {
        const findUser = await this.userData.find({
          where: [{ userId: args[1] }, { username: args[1] }],
        });
        if (findUser.length === 0) {
          return message
            .reply({
              content: `${this.messHelp}`,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(
                client,
                message.author.id,
                err
              );
            });
        }
        let i = 0;
        let mess = findUser
          .slice(i * 50, (i + 1) * 50)
          .map(
            (user) => `${user.email}(${user.userId}) toggle: ${user.deactive}`
          )
          .join("\n");
        const Embed = new EmbedBuilder()
          .setTitle(`User`)
          .setColor("Red")
          .setDescription(`${mess}`);
        await message.reply({ embeds: [Embed] }).catch(console.error);
      } else {
        let authorId = args[0];
        const checkRole = await this.notifiService.checkrole(message.author.id)

        if(checkRole.length > 0 || message.author.id === "922148445626716182") {
          const findUserId = await this.toggleActiveService.findAcc(authorId);
          if (!findUserId.deactive) {
            message
              .reply({
                content: "Disable account successfully",
              })
              .catch((err) => {
                this.komubotrestService.sendErrorToDevTest(
                  client,
                  message.author.id,
                  err
                );
              });

            await this.toggleActiveService.deactiveAcc(findUserId.userId);
          } else {
            await this.toggleActiveService.ActiveAcc(findUserId.userId);
            message
              .reply({
                content: "Enable account successfully",
              })
              .catch((err) => {
                this.komubotrestService.sendErrorToDevTest(
                  client,
                  message.author.id,
                  err
                );
              });
          }
        } else {
          return message
            .reply({
              content: "```You do not have permission to execute this command!```"
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(
                client,
                message.author.id,
                err
              );
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
