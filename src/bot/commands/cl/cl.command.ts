import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { CheckListController } from "src/bot/utils/checklist/checklist.controller";

@CommandLine({
  name: "cl",
  description: "checklist",
  cat: 'komu',
})
export class ClCommand implements CommandLineClass {
  constructor(private checklistController: CheckListController) {}
  async execute(message, args, client) {
    try {
      this.checklistController.execute(message, args, client);
    } catch (error) {
      console.log(error);
    }
  }
}
