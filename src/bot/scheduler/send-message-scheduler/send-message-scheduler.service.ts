import { Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { Client } from "discord.js";
import { UtilsService } from "src/bot/utils/utils.service";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { CronJob } from "cron";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { config } from "src/bot/constants/config";
import { getUserOffWork } from "src/bot/utils/getUserOffWork";
import { BirthdayService } from "src/bot/utils/birthday/birthdayservice";
import { KomubotrestController } from "src/bot/utils/komubotrest/komubotrest.controller";

@Injectable()
export class SendMessageSchedulerService {
  constructor(
    private utilsService: UtilsService,
    private readonly http: HttpService,
    @InjectRepository(User)
    private userReposistory: Repository<User>,
    private schedulerRegistry: SchedulerRegistry,
    @InjectDiscordClient()
    private client: Client,
    private birthdayService: BirthdayService,
    private komubotrestController: KomubotrestController
  ) {}

  private readonly logger = new Logger(SendMessageSchedulerService.name);

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
    // this.addCronJob("sendSubmitTimesheet", CronExpression.EVERY_MINUTE, () =>
    //   this.sendSubmitTimesheet(this.client)
    // );
    this.addCronJob("remindCheckout", CronExpression.EVERY_MINUTE, () =>
      this.remindCheckout(this.client)
    );
    this.addCronJob("happyBirthday", "00 00 09 * * 0-6", () =>
      this.happyBirthday(this.client)
    );
  }

  async sendMessagePMs(client) {
    if (await this.utilsService.checkHoliday()) return;
    const userDiscord = await client.channels.fetch("921787088830103593");
    userDiscord
      .send(
        `Đã đến giờ report, PMs hãy nhanh chóng hoàn thành report tuần này đi.`
      )
      .catch(console.error);
  }

  async sendMessTurnOffPc(client) {
    if (await this.utilsService.checkHoliday()) return;
    const staffRoleId = "921328149927690251";
    const channel = await client.channels.fetch("921239541388554240");
    const roles = await channel.guild.roles.fetch(staffRoleId);
    roles.members.map((member) => {
      try {
        member
          .send("Nhớ tắt máy trước khi ra về nếu không dùng nữa nhé!!!")
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async sendSubmitTimesheet(client) {
    let getListUserLogTimesheet;
    try {
      getListUserLogTimesheet = await firstValueFrom(
        this.http
          .get(config.submitTimesheet.api_url_getListUserLogTimesheet)
          .pipe((res) => res)
      );
    } catch (error) {
      console.log(error);
    }

    if (!getListUserLogTimesheet) {
      return;
    }
    getListUserLogTimesheet.data.result.map(async (item) => {
      const list = this.utilsService.getUserNameByEmail(item.emailAddress);
      const checkUser = await this.userReposistory
        .createQueryBuilder("user")
        .where(`"email" = :email`, {
          email: list,
        })
        .andWhere(`"deactive" IS NOT TRUE`)
        // .andWhere(`"roles_discord" IS NOT TRUE`)
        // roles_discord: { $ne: [], $exists: true },
        .select("user.*")
        .execute();

      checkUser.map(async (user) => {
        const userDiscord = await client.users
          .fetch(user.userId)
          .catch(console.error);
        userDiscord
          .send(
            `Nhớ submit timesheet cuối tuần tránh bị phạt bạn nhé!!! Nếu bạn có tham gia opentalk bạn hãy log timesheet vào project company activities nhé.`
          )
          .catch(console.error);
      });
    });
  }

  async remindCheckout(client) {
    if (await this.utilsService.checkHoliday()) return;
    try {
      const listsUser = await firstValueFrom(
        this.http
          .get(`${process.env.CHECKIN_API}/v1/employees/report-checkin`, {
            headers: {
              "X-Secret-Key": `${process.env.CHECKIN_API_KEY_SECRET}`,
            },
          })
          .pipe((res) => res)
      );
      const userListNotCheckIn = listsUser.data.filter(
        (user) => user.checkout === null
      );
      const { userOffFullday } = await getUserOffWork(null);
      console.log(userOffFullday, "userOffFullday");

      userListNotCheckIn.map(async (user) => {
        const checkUser = await this.userReposistory
          .createQueryBuilder("users")
          .where("email = :email", {
            email: user.komuUserName,
          })
          .orWhere("email = :email", {
            email: user.komuUserName,
          })
          .andWhere('"email" IN (:...userOffFullday)', {
            userOffFullday: userOffFullday,
          })
          .andWhere(`"deactive" IS NOT TRUE`)
          .select("users.*")
          .execute();

        if (checkUser && checkUser !== null) {
          const userDiscord = await client.users.fetch(checkUser.id);
          userDiscord
            .send(`Đừng quên checkout trước khi ra về nhé!!!`)
            .catch(console.error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async happyBirthday(client) {
    const result = await this.birthdayService.birthdayUser(client);

    try {
      await Promise.all(
        await result.map((item) =>
          this.komubotrestController.sendMessageToNhaCuaChung(
            client,
            `${item.wish} <@${item.user.id}> +1 trà sữa full topping nhé b iu`
          )
        )
      );
    } catch (error) {
      console.log(error);
    }
  }
}
