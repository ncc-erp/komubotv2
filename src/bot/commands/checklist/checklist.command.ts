import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { CheckListController } from "src/bot/utils/checklist/checklist.controller";

@CommandLine({
  name: "checklist",
  description: "daily work",
})
export class ChecklistCommand implements CommandLineClass {
  constructor(private checkListController: CheckListController) {}

  async execute(message, args, client) {
    try {
      await this.checkListController.execute(message, args, client);
    } catch (error) {}
  }
}
