import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { Channel } from "src/bot/models/channel.entity";
import { User } from "src/bot/models/user.entity";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { Repository } from "typeorm";

@CommandLine({
  name: "mv",
  description: "move channel",
  cat: 'komu',
})
export class MvChannelCommand implements CommandLineClass {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private komubotrestService: KomubotrestService
  ) {}

  messHelp = `*mv <this|channel> <category>`;

  async execute(message, args, client) {
    try {
      let authorId = message.author.id;
      const checkRole = await this.userRepository
        .createQueryBuilder()
        .where(`"roles_discord" = :roles_discord`, {
          roles_discord: ["PM"],
        })
        .andWhere(`"userId" = :userId`, {
          userId: authorId,
        })
        .andWhere(`"deactive" IS NOT TRUE`)
        .select(".*")
        .execute();

      if (checkRole.length === 0) {
        return message
          .reply({
            content:
              "```You do not have permission to execute this command!```",
            ephemeral: true,
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      }
      if (args[0] && args[1]) {
        const findCategory = args.slice(1, args.length).join(" ");

        let category = client.channels.cache.find(
          (cat) =>
            cat.id === findCategory ||
            cat.name.toUpperCase() === findCategory.toUpperCase()
        );
        const getChannel = client.channels.cache.find(
          (guild) =>
            guild.id === args[0] ||
            guild.name.toUpperCase() === args[0].toUpperCase()
        );

        if (getChannel && category) {
          const channel = await client.channels.fetch(getChannel.id);
          channel.setParent(category.id, { lockPermissions: false });
          await this.channelRepository.update(
            { channelId: args[0] },
            { parentId: category.id }
          );
          await message
            .reply({
              content: `move channel to ${category.name} successfully`,
              ephemeral: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
        } else {
          return message
            .reply({ content: this.messHelp, ephemeral: true })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
        }
      } else {
        return message
          .reply({ content: this.messHelp, ephemeral: true })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
