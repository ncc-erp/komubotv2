import { Command } from "@discord-nestjs/core";
import { Message } from "discord.js";
import { CommandLine, CommandLineClass } from "../../base/command.base";

const messHelp = "```" + "*ping" + "```";

@CommandLine({
  name: "ping",
  description: "Ping",
})
export class PingCommand implements CommandLineClass {
  constructor() {}

  async execute(message: Message, args, Client) {
    try {
      let authorId = message.author.id;
      if (!args[0]) {
        return message.channel.send(`Pong!\`${this.execute}ms\``);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
// export class PingCommand extends Command {
//   public constructor(
//     context: CommandCursor.Context,
//     options: CommandCursor.Options
//   ) {
//     super(context, {
//       ...options,
//       name: "ping",
//       aliases: ["latency"],
//       description:
//         "see the latency in milliseconds between the discord API and server",
//       fullCategory: ["general"],
//     });
//   }

//   public messageRun(message: Message){
//     return message.channel.send(`Pong!\`${this.container.Client.ws.ping}ms\``)
//   }
// }
