import { InjectDiscordClient } from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { Client } from "discord.js";
import { UtilsService } from "src/bot/utils/utils.service";
import { CronJob } from "cron";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { getUserOffWork } from "src/bot/utils/getUserOffWork";
import { User } from "src/bot/models/user.entity";
import { SendQuizToSingleUserService } from "src/bot/utils/sendQuizToSingleUser/sendQuizToSingleUser.service";

@Injectable()
export class SendquizSchedulerService {
  constructor(
    private utilsService: UtilsService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private sendQuizToSingleUserService: SendQuizToSingleUserService,
    private schedulerRegistry: SchedulerRegistry,
    @InjectDiscordClient()
    private client: Client
  ) {}

  private readonly logger = new Logger(SendquizSchedulerService.name);

  addCronJob(name: string, time: string, callback: () => void): void {
    const job = new CronJob(
      time,
      () => {
        this.logger.warn(`time (${time}) for job ${name} to run!`);
        callback();
      },
      null,
      true,
      "Asia/Ho_Chi_Minh"
    );

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(`job ${name} added for each minute at ${time} seconds!`);
  }

  // Start cron job
  startCronJobs(): void {
    this.addCronJob("sendQuiz", "0 9,11,13,15 * * 1-5", () =>
      this.sendQuiz(this.client)
    );
    this.addCronJob("sendQuizEnglish", "0 10,11,14,16 * * 1-5", () =>
      this.sendQuizEnglish(this.client)
    );
  }

  async sendQuiz(client) {
    try {
      if (await this.utilsService.checkHoliday()) return;
      let userOff = [];
      try {
        const { notSendUser } = await getUserOffWork(null);
        userOff = notSendUser;
      } catch (error) {
        console.log(error);
      }

      const userSendQuiz = await this.userRepository
        .createQueryBuilder("user")
        .innerJoin("komu_msg", "m", "user.last_bot_message_id = m.id")
        .where(
          userOff && userOff.length > 0
            ? '"email" NOT IN (:...userOff)'
            : "true",
          {
            userOff: userOff,
          }
        )
        .andWhere('"deactive" IS NOT True')
        .andWhere('("roles_discord" @> :intern OR "roles_discord" @> :staff)', {
          intern: ["INTERN"],
          staff: ["STAFF"],
        })
        .andWhere('"last_bot_message_id" IS NOT Null')
        .select("*")
        .execute();

      const millisecondsOfTwoHours = 1000 * 60 * 60 * 2;
      let arrayUser = userSendQuiz.filter(
        (user) =>
          !user.createdTimestamp ||
          Date.now() - user.createdTimestamp >= millisecondsOfTwoHours
      );
      await Promise.all(
        arrayUser.map((user) =>
          this.sendQuizToSingleUserService.sendQuizToSingleUser(
            client,
            user,
            false
          )
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  async sendQuizEnglish(client) {
    try {
      if (await this.utilsService.checkHoliday()) return;
      let userOff = [];
      try {
        const { notSendUser } = await getUserOffWork(null);

        userOff = notSendUser;
      } catch (error) {
        console.log(error);
      }

      const userSendQuiz = await this.userRepository
        .createQueryBuilder("users")
        .where(
          userOff && userOff.length ? '"email" NOT IN (:...userOff)' : "true",
          {
            userOff: userOff,
          }
        )
        .andWhere(`"deactive" IS NOT TRUE`)
        .select("users.*")
        .execute();

      await Promise.all(
        userSendQuiz.map((user) =>
          this.sendQuizToSingleUserService.sendQuizToSingleUser(
            client,
            user,
            false,
            "english"
          )
        )
      );
    } catch (error) {
      console.log(error);
    }
  }
}
