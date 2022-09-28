import { InjectRepository } from "@nestjs/typeorm";
import { EmbedBuilder } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { User } from "src/bot/models/user.entity";
import { UserQuiz } from "src/bot/models/userQuiz";
import { Repository } from "typeorm";

@CommandLine({
  name: "update",
  description: "update point quiz user",
  cat: 'komu',
})
export class UpdateCommand implements CommandLineClass {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserQuiz)
    private readonly userQuizRepository: Repository<UserQuiz>
  ) {}

  async execute(message, args) {
    try {
      if (args[0] === "point") {
        const user = await this.userRepository.find();
        const userids = user.map((item) => item.userId);
        for (let userId of userids) {
          const countQuizCorrect = await this.userQuizRepository.find({
            where: {
              userId: userId,
              correct: true,
            },
          });
          const point = countQuizCorrect.length * 5;
          await this.userRepository.update(
            { userId: userId },
            { scores_quiz: point }
          );
        }
        message.channel.send("Update Point Successfully");
      }
    } catch (err) {
      console.log(err);
    }
  }
}
