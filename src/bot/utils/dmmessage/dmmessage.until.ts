const API_TOKEN = "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";
const API_URL = "http://172.16.100.111:3000/webhooks/rest/webhook";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { TABLE } from "src/bot/constants/table";
import { Conversation } from "src/bot/models/conversation.entity";
import { Repository } from "typeorm";
import { Sync_role } from "../../commands/sync_roles/sync_role.command";
import { ToggleActiveCommand } from "../../commands/toggleActive/toggleActive.command";
import { UserStatusCommand } from "../../commands/user_status/user_status.command";
export class DmMessageUntil {
  constructor(
    private userStatusCommand: UserStatusCommand,
    private toggleActiveCommand: ToggleActiveCommand,
    private syncRole: Sync_role,
    @InjectRepository(Conversation)
    private dmMessageReposistory: Repository<Conversation>
  ) {}

  async getMessageAI(url, sender, message, token) {
    try {
      const response = await axios.post(
        url,
        {
          sender,
          message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response;
    } catch (e) {
      return null;
    }
  }

  async dmmessage(message, client) {
    try {
      const checkArgs = message.content.split(" ").shift();
      const args = message.content.split(" ").splice(1);
      switch (checkArgs) {
        case "*userstatus":
          return this.userStatusCommand.execute(message, args, client);
        case "*toggleactivation":
          return this.toggleActiveCommand.execute(message, args, client);
        case "*sync":
          return this.syncRole.execute(message, args, client);

        //doan nay da dc comment tu dau
        // case '/tick':
        //   return const slashTicket = ticket.execute(message, client);
        // case '/keep':
        //   return const keep = ticket.execute(message, client);
        // case '/wiki':
        //   return const wiki = ticket.execute(message, client);
        default:
          break;
      }
      const channelId = message.channelId;
      const createdTimestamp = message.createdTimestamp;
      const authorId = message.author.id;
      const content = message.content;

      // const data = await conversationData
      //   .findOne({
      //     channelId: channelId,
      //     authorId: authorId,
      //     createdTimestamp: { $gte: Date.now() - 20000 },
      //   })
      //   .catch(console.log);
      const data = await this.dmMessageReposistory
        .createQueryBuilder(TABLE.CONVERSATION)
        .where(`${TABLE.CONVERSATION}.channelId = :channelId`, {
          channelId: channelId,
        })
        .andWhere(`${TABLE.CONVERSATION}.authorId = :authorId`, {
          authorId: authorId,
        })
        .andWhere(
          `${TABLE.CONVERSATION}.createdTimestamp > ${Date.now() - 20000}`,
          { createdTimestamp: createdTimestamp }
        )
        .execute();

      if (!authorId || !content) return;
      const res = await this.getMessageAI(
        API_URL,
        message.author.username,
        `${content}`,
        API_TOKEN
      );

      if (res && res.data && res.data.length) {
        res.data.map((item) => {
          return message.channel.send(item.text).catch(console.log);
        });
      } else {
        message.channel
          .send("Very busy, too much work today. I'm so tired. BRB.")
          .catch(console.error);
        return;
      }
      // can check lai cho nay
      // if (data) {
      //   await this.dmMessageReposistory
      //     .updateOne(
      //       { _id: data._id },
      //       {
      //         past_user_inputs: [content],
      //         generated_responses: res.data.map((item) => item.text),
      //         updatedTimestamp: createdTimestamp,
      //       }
      //     )
      //     .catch(console.log);
      // } else {
      //   await new conversationData({
      //     channelId: channelId,
      //     authorId: authorId,
      //     createdTimestamp: createdTimestamp,
      //     updatedTimestamp: createdTimestamp,
      //     past_user_inputs: [content],
      //     generated_responses: res.data.map((item) => item.text),
      //   })
      //     .save()
      //     .catch(console.log);
      // }
    } catch (error) {
      console.error(error);
    }
  }
}
