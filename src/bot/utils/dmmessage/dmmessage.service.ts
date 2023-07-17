import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserStatusCommand } from "src/bot/commands/user_status/user_status.command";
import { ToggleActiveCommand } from "src/bot/commands/toggleActive/toggleActive.command";
import { Sync_role } from "src/bot/commands/sync_roles/sync_role.command";
import { Conversation } from "src/bot/models/conversation.entity";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Client, Message, EmbedBuilder } from "discord.js";
import { ActionRowBuilder, ButtonBuilder, } from "discord.js";

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
  API_URL = "http://172.16.100.196:8000/query/";
  API_RATING = "http://172.16.100.196:8000/update-history/?history_id=";

  
  async getMessageAI(url, sender, message, token) {
    try {
      const response = await firstValueFrom(
        this.http
          .post(
            url,
            { "question": message },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .pipe((res) => res)
      );
      return response as any;
    } catch (e) {
      return null;
    }
  }

  async sendRatingAi(url, messageId, rating, token) {
    try {
      const response = await firstValueFrom(
        this.http
          .put(
            url+messageId,
            {   
              "status": "RAW",
              "rating": rating,
              "refine": "string"
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

  async ratting(client: Client, user, messageId) {
    const label: string[] = ["Very Bad", "Bad", "Ok", "Good", "Very Good"];
    const buttons: ButtonBuilder[] = [];
    
    for (let i = 0; i < 5; i++) {
      buttons.push(new ButtonBuilder()
        .setCustomId("rating_answer" + messageId + "#" + (i+1))
        .setLabel(label[i])
        .setStyle(1)
      );
    }

    const row = new ActionRowBuilder().addComponents(buttons);
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Is This Helpful!");
  
    client.setMaxListeners(0);    
    client.on("interactionCreate", async (interaction) => {
      if (interaction.isButton()) {
        const customId = interaction.customId;
        if(!customId.includes(messageId)){
          return;
        }
        const rating = parseInt(customId.replace("rating_answer" + messageId + "#", ""));
        const ratingRes = await this.sendRatingAi(this.API_RATING, messageId, rating, this.API_TOKEN);

        if (ratingRes) {
          await interaction.reply({ content: `Thank you for your rating!`, ephemeral: true, fetchReply: true }).catch(err => {
            console.log(rating);
          });
          interaction.message.edit({ components: [] }).catch(console.error);
        }
      }
    });
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
        `${content}`,
        this.API_TOKEN
      );
      if(!res){
        message.reply("không có câu trả lời cho câu hỏi của bạn");
        return;
      }
      this.ratting(client, message.author, res.data.id);
     
      if (res && res.data && res.data.length) {
        res.data.map((item) => {
          return message.channel.send(item.text).catch(console.log);
        });
      } else {
        const reply = res.data.answer;
        message.channel
          .send(reply)
          .catch(console.error);
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
