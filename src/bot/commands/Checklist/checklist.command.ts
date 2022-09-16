import { Message , Client} from "discord.js";

import { CommandLine, CommandLineClass } from "../../base/command.base";
import { CheckListController } from "./checklist.controller";

@CommandLine({
  name: "checklist",
  description: "checklist",
})
export class ChecklistCommand implements CommandLineClass {
  constructor(private checklistController: CheckListController, ) {}
  private client : Client;
    async execute(message: Message, args) {
      try {
      //  checkList(message, args, Client);
        this.checklistController.execute(message, args, this.client);
      } catch (error) {
        console.log(error);
      }
    }
}
