import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserStatusCommand } from "src/bot/commands/user_status/user_status.command";
import { ToggleActiveCommand } from "src/bot/commands/toggleActive/toggleActive.command";
import { Sync_role } from "src/bot/commands/sync_roles/sync_role.command";
import { Conversation } from "src/bot/models/conversation.entity";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Client, Message } from "discord.js";
import { content } from "googleapis/build/src/apis/content";

@Injectable()
export class DmmessageService {
  constructor(
    private userStatusCommand: UserStatusCommand,
    private toggleActiveCommand: ToggleActiveCommand,
    private syncRole: Sync_role,
    @InjectRepository(Conversation)
    private dmMessageRepository: Repository<Conversation>,
    private readonly http: HttpService
  ) {}

  API_TOKEN = "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";
  //API_URL = "http://172.16.100.111:3000/webhooks/rest/webhook";
  API_URL = "http://172.16.100.196:8000/query/?query=";

  async getMessageAI(url, sender, message, token) {
    try {
      const response = await firstValueFrom(
        this.http
          .post(
            url,
            {
              'question': message
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .pipe((res) => res)
      );
      return response as any;
    } catch (e) {
      return null;
    }
  }

  async dmmessage(message: Message, client: Client) {
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
      const defaultReply = "Very busy, too much work today. I'm so tired. (DM)";

      const data = await this.dmMessageRepository
        .createQueryBuilder()
        .where(`"channelId" = :channelId`, {
          channelId: channelId,
        })
        .andWhere(`"authorId" = :authorId`, {
          authorId: authorId,
        })
        .andWhere(`"createdTimestamp" > ${Date.now() - 20000}`, {
          createdTimestamp: createdTimestamp,
        })
        .execute();

      if (!authorId || !content) return;
      const res = await this.getMessageAI(
        this.API_URL,
        message.author.username,
        content,
        this.API_TOKEN
      );

      if (res && res.data && res.data.length) {
        res.data.map((item) => {
          message.channel.send(item.text).catch(console.log);
          return;
        });
      } else 
      {
        console.log(res);
        if (res == null || res.data == null || res.data.answer == null)
        {
          message.channel
          .send(defaultReply)
          .catch(console.error);
        }
        else
        {
          message.channel
          .send(res.data.answer)
          .catch(console.error);
        }
        return;
      }
      if (data) {
        await this.dmMessageRepository
          .update(
            { id: data.id },
            {
              past_user_inputs: [content],
              generated_responses: res.data.map((item) => item.text),
              updatedTimestamp: createdTimestamp,
            }
          )
          .catch(console.log);
      } else {
        await this.dmMessageRepository
          .insert({
            channelId: channelId,
            authorId: authorId,
            createdTimestamp: createdTimestamp,
            updatedTimestamp: createdTimestamp,
            past_user_inputs: [content],
            generated_responses: res.data.map((item) => item.text),
          })
          .catch(console.log);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
