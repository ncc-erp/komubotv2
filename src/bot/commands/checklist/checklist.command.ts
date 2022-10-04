import { Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { CheckListController } from "src/bot/utils/checklist/checklist.controller";

@CommandLine({
  name: "checklist",
  description: "checklist",
  cat: "komu",
})
export class ChecklistCommand implements CommandLineClass {
  constructor(private checkListController: CheckListController) {}

  async execute(message: Message, args, client) {
    try {
      await this.checkListController.execute(message, args, client);
    } catch (error) {}
  }
}
