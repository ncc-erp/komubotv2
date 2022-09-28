import { EmbedBuilder } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { firstValueFrom } from "rxjs";
import { getUserOffWork } from "src/bot/utils/getUserOffWork";

@CommandLine({
  name: "test",
  description: "Gem rank",
  cat: 'komu',
})
export class TestCommand implements CommandLineClass {
  constructor() {}

  async execute(message, args, client) {
    const { notSendUser, userOffFullday, userOffMorning, userOffAffternoon } =
      await getUserOffWork(null);
    console.log(notSendUser, "notSendUser");
    console.log(userOffFullday, "userOffFullday");
    console.log(userOffMorning, "userOffMorning");
    console.log(userOffAffternoon, "userOffAffternoon");
  }
}
