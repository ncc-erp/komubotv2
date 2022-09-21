import { Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import axios from "axios";
import { UserStatusService } from "./user_status.service";
import { sendErrorToDevTest } from "src/bot/utils/komubotrest.utils";

@CommandLine({
  name: "userstatus",
  description: "users tatus",
})
export class UserStatusCommand implements CommandLineClass {
  constructor(private readonly userStatusService: UserStatusService) {}
  async execute(message: Message, args, client) {
    try {
      let authorId = message.author.id;
      if (args[0] === "help" || !args[0]) {
        return message.channel.send(
          "```" +
            "Command: *userstatus username" +
            "\n" +
            "Example: *userstatus a.nguyenvan" +
            "```"
        );
      }

      let email = args[0];
      // const user = await userData.findOne({
      //   $or: [{ email }, { username: email }],
      // });

      const user = await this.userStatusService.getUserStatus(email);
      if (!user)
        return message.reply(`Wrong Email!`).catch((err) => {
          sendErrorToDevTest(client, authorId, err);
        });
      const getUserStatus = await axios.get(
        `${process.env.TIMESHEET_API}Public/GetWorkingStatusByUser?emailAddress=${email}@ncc.asia`
      );
      if (!getUserStatus.data) return;

      let mess;

      if (!getUserStatus.data.result) {
        mess = "Work At Office";
      } else {
        mess = getUserStatus.data.result.message;
      }

      return message.reply(mess).catch((err) => {
        sendErrorToDevTest(client, authorId, err);
      });
    } catch (e) {
      console.log(e);
    }
  }
}
