import { InjectDiscordClient } from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { Client } from "discord.js";
import { UtilsService } from "src/bot/utils/utils.service";
import { CronJob } from "cron";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { getUserOffWork } from "src/bot/utils/getUserOffWork";
import { SendQuizToSingleUserService } from "src/bot/utils/sendQuizToSingleUser.until";
import { User } from "src/bot/models/user.entity";

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
    const job = new CronJob(time, () => {
      this.logger.warn(`time (${time}) for job ${name} to run!`);
      callback();
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(`job ${name} added for each minute at ${time} seconds!`);
  }

  // Start cron job
  startCronJobs(): void {
    // this.addCronJob("sendQuiz", CronExpression.EVERY_10_SECONDS, () =>
    //   this.sendQuiz(this.client)
    // );
    // this.addCronJob("sendQuizEnglish", CronExpression.EVERY_10_SECONDS, () =>
    //   this.sendQuizEnglish(this.client)
    // );
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
        .innerJoinAndSelect("user.msg", "msg")
        .where('"email" NOT IN (:...userOff)', {
          userOff: userOff,
        })
        .andWhere('"deactive" IS NOT True')
        .where("roles_discord = :roles_discord", {
          roles_discord: ["INTERN"],
        })
        .orWhere("roles_discord = :roles_discord", {
          roles_discord: ["STAFF"],
        })
        .andWhere('"last_bot_message_id" IS NOT Null')
        .innerJoinAndSelect("user.msg", "msg")
        .select("*")
        .getRawOne();

      // console.log(userSendQuiz[0].msg);

      let arrayUser = userSendQuiz.filter(
        (user) =>
          !user.last_message_time ||
          Date.now() - user.last_message_time >= 1000 * 60 * 60 * 2
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
        .where('"email"  (:...userOff)', {
          userOff: userOff,
        })
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
