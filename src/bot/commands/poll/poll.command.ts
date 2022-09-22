import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { PollEmbedUntil } from "src/bot/utils/poll/pollEmbed.until";

@CommandLine({
  name: "poll",
  description: "create a poll",
})
export class PollCommand implements CommandLineClass {
  constructor(private readonly pollEmbedUntil: PollEmbedUntil) {}
  async execute(message, args) {
    const cmds = args.join(" ").split("+");
    const options = cmds.slice(1);

    await this.pollEmbedUntil
      .pollEmbed(
        message,
        cmds[0].trim(),
        options.map((element) => {
          return element.trim();
        })
      )
      .catch(console.error);
  }
}
