import { Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { ClientConfigService } from "src/bot/config/client-config.service";

@CommandLine({
  name: "reload",
  description: "Reloads a command",
  cat: "owner",
})
export class ReloadCommand implements CommandLineClass {
  constructor(private clientConfigService: ClientConfigService) {}

  execute(message, args, client) {
    if (!this.clientConfigService.owners.includes(message.author.id)) return;

    const commandName = args[1].toLowerCase();
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );
    if (!command) {
      return message.channel.send(
        "`❌` No commands found for " + commandName + ". Please try again."
      );
    }
    delete require.cache[require.resolve(`../${args[0]}/${commandName}.js`)];
    try {
      const newCommand = require(`../${args[0]}/${commandName}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(
        "`✅` The command " +
          newCommand.name +
          " has been succesfully reloaded on the current shard "
      );
    } catch (error) {
      console.error(error);
      message.channel.send(
        "`❌` Something whent wrong while reloading the command:\n`" +
          error.message +
          "`"
      );
    }
  }
}
