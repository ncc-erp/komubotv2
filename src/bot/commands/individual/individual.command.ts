import { Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "../../base/command.base";
import { IndividualChannelService } from "./individual.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";

const messHelp =
  '```' +
  '*individual add @username' +
  '\n' +
  '*individual create <channelName>' +
  '\n' +
  '*individual remove @username' +
  '\n' +
  '*individual delete <channelId>' +
  '```';
@CommandLine({
  name: "individual",
  description: "Individual Channel",
  cat: "komu",
})
export class IndividualChannelCommand implements CommandLineClass {
  constructor(
    private individualChannelService: IndividualChannelService,
    private komubotrestService: KomubotrestService
  ) { }

  async execute(message: Message, args, client: Client) {
    try {
      const channelId = message.channel.id;
      const authorId = message.author.id;
      const authorUsername = message.author.username;
      if (!args[0] || args[0] === 'help') {
        return message.channel.send(messHelp);
      } else if (args[0] === 'add') {
        if (await this.individualChannelService.addUserToChannel(message))
          return message
            .reply({
              content: '`✅` Add User Successfully.',
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });

        return message
          .reply({
            content: '`❌` Add User Failed.',
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      } else if (args[0] === 'remove') {
        if (await this.individualChannelService.removeUserFromChannel(message))
          return message
            .reply({
              content: '`✅` Remove User Successfully.',
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });

        return message
          .reply({
            content: '`❌` Remove User Failed.',
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      } else if (args[0] === 'create') {
        let channelName = args.filter((v, i) => i > 0).join('-');
        if (await this.individualChannelService.createChannel(message, channelName))
          return message
            .reply({
              content: '`✅` Create Channel Successfully.',
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });

        return message
          .reply({
            content: '`❌` Create Channel Failed.',
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      } else if (args[0] === 'delete') {
        if (await this.individualChannelService.deleteChannel(message, args[1]))
          return message
            .reply({
              content: '`✅` Delete Channel Successfully.',
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });

        return message
          .reply({
            content: '`❌` Delete Channel Failed.',
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
