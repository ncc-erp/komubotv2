import { CommandLine, CommandLineClass } from "../../base/command.base";

@CommandLine({
  name: "kick",
  description: "kickbot",
})
export class KickbotCommand implements CommandLineClass {
  constructor() {}

  async execute(message) {
    try {
      const target = message.mentions.members.first();
      target.voice.disconnect().catch(console.error);
    } catch (e) {
      console.log(e);
    }
  }
}
