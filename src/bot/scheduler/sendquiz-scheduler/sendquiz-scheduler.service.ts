import { InjectDiscordClient } from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { Client } from "discord.js";
import { UtilsService } from "src/bot/utils/utils.service";
import { CronJob } from "cron";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Mentioned } from "src/bot/models/mentioned.entity";
import moment from "moment";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { getUserOffWork } from "src/bot/utils/getUserOffWork";

@Injectable()
export class SendquizSchedulerService {
  constructor(
    private utilsService: UtilsService,
    // @InjectRepository(Mentioned)
    // private mentionReposistory: Repository<Mentioned>,
    // @InjectRepository(WorkFromHome)
    // private wfhReposistory: Repository<WorkFromHome>,
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
    // this.addCronJob("checkMention", CronExpression.EVERY_MINUTE, () =>
    //   this.checkMention(this.client)
    // );
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

      console.log(userOff, "notSendUser");
      // const userSendQuiz = await userData
      //   .find({
      //     email: { $nin: userOff },
      //     deactive: { $ne: true },
      //   })
      //   .select("id roles username -_id");

      // await Promise.all(
      //   userSendQuiz.map((user) =>
      //     sendQuizToSingleUser(client, user, false, "english")
      //   )
      // );
    } catch (error) {
      console.log(error);
    }
  }
}
