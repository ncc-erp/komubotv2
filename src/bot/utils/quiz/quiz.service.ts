import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmbedBuilder } from "discord.js";
import { Holiday } from "src/bot/models/holiday.entity";
import { Quiz } from "src/bot/models/quiz.entity";
import { User } from "src/bot/models/user.entity";
import { UserQuiz } from "src/bot/models/userQuiz";
import { Repository } from "typeorm";
import { KomubotrestService } from "../komubotrest/komubotrest.service";

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(User)
    private userReposistory: Repository<User>,
    @InjectRepository(UserQuiz)
    private userQuizReposistory: Repository<UserQuiz>,
    @InjectRepository(Quiz)
    private quizReposistory: Repository<Quiz>,
    private komubotrestService: KomubotrestService
  ) {}

  async randomQuiz(userInput, context, type, roleSelect) {
    // context is message or client
    // message if this is commands
    // client if this is scheduler
    // type is commands or scheduler

    try {
      let roles;
      let roleRandom;
      if (!roleSelect) {
        if (userInput.roles && userInput.roles.length > 0) {
          roles = [...userInput.roles, "policy", "english"];
          roleRandom =
            roles[Math.floor(Math.random() * roles.length)].toLowerCase();
        } else {
          roleRandom = "policy";
        }
      } else {
        roleRandom = roleSelect;
      }

      const questionAnswered = await this.userQuizReposistory.find({
        where: {
          userId: userInput.id,
        },
      });

      let questionAnsweredId = questionAnswered.map((item) => item.quizId);

      // const questions = await questionData.aggregate([
      //   {
      //     $match: {
      //       _id: { $nin: questionAnsweredId },
      //       role: roleRandom,
      //       isVerify: true,
      //       accept: true,
      //     },
      //   },
      //   {
      //     $match: {
      //       title: { $exists: true },
      //       $expr: { $lte: [{ $strLenCP: "$title" }, 236] },
      //     },
      //   },
      //   {
      //     $sample: { size: 1 },
      //   },
      // ]);
      // if (Array.isArray(questions) && questions.length === 0) {
      //   const mess = "You have answered all the questions!!!";
      //   if (type === "commands") {
      //     await context.channel.send(mess).catch(console.error);
      //   } else {
      //     return;
      //   }
      // } else {
      //   return questions[0];
      // }
    } catch (error) {
      console.log(error);
    }
  }

  embedQuestion(question) {
    const title = question.topic
      ? `[${question.topic.toUpperCase()}] ${question.title}`
      : question.title;
    const Embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(
        "```" +
          question.options
            .map((otp, index) => `${index + 1} - ${otp}`)
            .join("\n") +
          "```"
      )
      .setColor("Random")
      .setFooter({
        text: "Reply to this message with the correct question number!",
      });
    return Embed;
  }
  async addScores(userId) {
    try {
      const user = await this.userReposistory
        .createQueryBuilder("users")
        .where('"userId = :userId"', { userId: userId })
        .andWhere('"deactive" IS NOT True')
        .select("users.*")
        .execute();

      let newUser;
      if (user.scores_quiz) {
        user.scores_quiz = user.scores_quiz + 5;
        newUser = await user.save();
      } else {
        user.scores_quiz = 5;
        newUser = await user.save();
      }
      return newUser;
    } catch (error) {
      console.log(error);
    }
  }

  async saveQuestionCorrect(userId, questionid, answerkey) {
    try {
      await this.userQuizReposistory.update(
        {
          userId,
          quizId: questionid,
        },
        {
          correct: true,
          answer: answerkey,
          updateAt:  Date.now(),
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async saveQuestionInCorrect(userId, questionid, answerkey) {
    try {
      await this.userQuizReposistory.update(
        {
          userId,
          quizId: questionid,
        },
        {
          correct: false,
          answer: answerkey,
          updateAt: Date.now(),
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async saveQuestion(userId, questionid) {
    try {
      await this.userQuizReposistory
        .insert({
          userId,
          quizId: questionid,
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }
}
