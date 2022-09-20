import { Message , Client} from "discord.js";

import { CommandLine, CommandLineClass } from "../base/command.base";
import { CheckListController } from "../utils/checklist/checklist.controller";


@CommandLine({
  name: "checklist",
  description: "checklist",
})
export class ChecklistCommand implements CommandLineClass {
  constructor(private checklistController: CheckListController, ) {}
    private client : Client;
    async execute(message: Message, args) {
      try {
        this.checklistController.execute(message, args, this.client);
      } catch (error) {
        console.log(error);
      }
    }
}
