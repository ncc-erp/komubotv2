import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmbedBuilder } from "discord.js";
import { TABLE } from "src/bot/constants/table";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import { UtilsService } from "../utils.service";

@Injectable()
export class ReportScoreService {
  constructor(
    @InjectRepository(User)
    private userReposistory: Repository<User>,
    private utilsService: UtilsService
  ) {}

  async reportScore(message) {
    try {
      const userid = message.author.id;
      const username = message.author.username;

      if (!userid || !username) return;

      const scoresQuizData = await this.userReposistory
        .createQueryBuilder(TABLE.USER)
        .where(`${TABLE.USER}.deactive = :deactive`, { deactive: true })
        .orderBy(`${TABLE.USER}.scores_quiz`, "ASC")
        .limit(10)
        .execute();

      let mess;
      if (Array.isArray(scoresQuizData) && scoresQuizData.length === 0) {
        mess = "```" + "no result" + "```";
      } else {
        mess = scoresQuizData
          .map(
            (item) =>
              `<@${item.id}>(${item.username}) - ${
                item.scores_quiz || 0
              } points`
          )
          .join("\n");
      }

      const Embed = new EmbedBuilder()
        .setTitle("Top 10 quiz points")
        .setColor("Red")
        .setDescription(`${mess}`);
      return message.reply({ embeds: [Embed] }).catch(console.error);
    } catch (error) {
      console.log(error);
    }
  }
}
