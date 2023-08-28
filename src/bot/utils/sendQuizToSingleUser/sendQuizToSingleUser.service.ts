import { Injectable } from "@nestjs/common";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { QuizService } from "../quiz/quiz.service";

@Injectable()
export class SendQuizToSingleUserService {
  constructor(
    private quizService: QuizService,
    private komubotrestService: KomubotrestService
  ) {}
  async sendQuizToSingleUser(
    client,
    userInput,
    botPing = false,
    roleSelect = null
  ) {
    try {
      // random userid
      if (!userInput) return;
      const userid = userInput.userId;
      const username = userInput.username;

      const q = await this.quizService.randomQuiz(
        userInput,
        client,
        "scheduler",
        roleSelect
      );

      if (!q) return;
      // const btn = new MessageEmbed()
      //   .setColor('#e11919')
      //   .setTitle('Complain')
      //   .setURL(`http://quiz.nccsoft.vn/question/update/${q._id}`);

      const Embed = this.quizService.embedQuestion(q);
      const LIMIT = 5;
      const totalRow = Math.ceil(q.options.length / LIMIT);
      if (totalRow === 1) {
        const row = new ActionRowBuilder();
        for (let i = 0; i < q.options.length; i++) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(
                `question_&id=${q.id}&key=${i + 1}&correct=${
                  q.correct
                }&userid=${userid}`
              )
              .setLabel((i + 1).toString())
              .setStyle(ButtonStyle.Primary)
          );
        }
        await this.komubotrestService.sendMessageKomuToUser(
          client,
          { embeds: [Embed], components: [row] },
          username,
          botPing,
          true
        );
        await this.quizService.saveQuestion(userid, q.id);
      } else if (totalRow == 2) {
        const row1 = new ActionRowBuilder();
        const row2 = new ActionRowBuilder();
        for (let i = 0; i < q.options.length; i++) {
          if (i <= 4) {
            row1.addComponents(
              new ButtonBuilder()
                .setCustomId(
                  `question_&id=${q.id}&key=${i + 1}&correct=${
                    q.correct
                  }&userid=${userid}`
                )
                .setLabel((i + 1).toString())
                .setStyle(ButtonStyle.Primary)
            );
          } else {
            row2.addComponents(
              new ButtonBuilder()
                .setCustomId(
                  `question_&id=${q.id}&key=${i + 1}&correct=${
                    q.correct
                  }&userid=${userid}`
                )
                .setLabel((i + 1).toString())
                .setStyle(ButtonStyle.Primary)
            );
          }
        }
        await this.komubotrestService.sendMessageKomuToUser(
          client,
          { embeds: [Embed], components: [row1, row2] },
          username,
          botPing
        );
        await this.quizService.saveQuestion(userid, q.id);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
