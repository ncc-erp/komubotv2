import { Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import {
  AttachmentBuilder,
  Client,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { UtilsService } from "src/bot/utils/utils.service";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { CronJob } from "cron";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { getUserOffWork } from "src/bot/utils/getUserOffWork";
import { BirthdayService } from "src/bot/utils/birthday/birthdayservice";
import { OdinReportService } from "src/bot/utils/odinReport/odinReport.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { Workout } from "src/bot/models/workout.entity";

@Injectable()
export class SendMessageSchedulerService {
  constructor(
    private utilsService: UtilsService,
    private readonly http: HttpService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Workout)
    private workoutRepository: Repository<Workout>,
    private schedulerRegistry: SchedulerRegistry,
    @InjectDiscordClient()
    private client: Client,
    private birthdayService: BirthdayService,
    private komubotrestService: KomubotrestService,
    private odinReportService: OdinReportService,
    private clientConfigService: ClientConfigService
  ) {}

  private readonly logger = new Logger(SendMessageSchedulerService.name);

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
    this.addCronJob("sendMessagePMs", "00 15 * * 2", () =>
      this.sendMessagePMs(this.client)
    );
    this.addCronJob("sendMessTurnOffPc", "30 17 * * 1-5", () =>
      this.sendMessTurnOffPc(this.client)
    );
    this.addCronJob("sendSubmitTimesheet", "00 12 * * 0", () =>
      this.sendSubmitTimesheet(this.client)
    );
    this.addCronJob("remindCheckout", "00 18 * * 1-5", () =>
      this.remindCheckout(this.client)
    );
    this.addCronJob("happyBirthday", "00 09 * * 0-6", () =>
      this.happyBirthday(this.client)
    );
    this.addCronJob("sendOdinReport", "14 00 * * 1", () =>
      this.sendOdinReport(this.client)
    );
    this.addCronJob("topTracker", "45 08 * * 1-5", () =>
      this.topTracker(this.client)
    );
    this.addCronJob("sendReportWorkout", "0 0 1 * *", () =>
      this.sendReportWorkout(this.client)
    );
    this.addCronJob("sendReportNotUploadFollowWeek", "00 09 * * 0-6", () =>
      this.sendReportNotUpload(this.client)
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

  async sendMessTurnOffPc(client: Client) {
    if (await this.utilsService.checkHoliday()) return;
    const users = await this.userRepository
      .createQueryBuilder()
      .where('("roles_discord" @> :hr OR "roles_discord" @> :staff)', {
        hr: ["HR"],
        staff: ["STAFF"],
      })
      .select("*")
      .execute();

    users.map(async (user) => {
      try {
        const channel = await client.users.fetch(user.userId);
        return channel
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
          .get(
            this.clientConfigService.submitTimesheet
              .api_url_getListUserLogTimesheet
          )
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
      const checkUser = await this.userRepository
        .createQueryBuilder()
        .where(`"email" = :email`, {
          email: list,
        })
        .andWhere(`"deactive" IS NOT TRUE`)
        .andWhere(`"roles_discord" IS NOT NUll`)
        .select("*")
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

  async remindCheckout(client: Client) {
    if (await this.utilsService.checkHoliday()) return;
    try {
      const listsUser = await firstValueFrom(
        this.http
          .get(this.clientConfigService.checkout.api_url, {
            headers: {
              "X-Secret-Key": `${this.clientConfigService.komubotRestSecretKey}`,
            },
          })
          .pipe((res) => res)
      );

      const userListNotCheckIn = listsUser.data.filter(
        (user) => user.checkout === null
      );
      const { userOffFullday } = await getUserOffWork(null);

      userListNotCheckIn.map(async (user) => {
        const checkUser = await this.userRepository
          .createQueryBuilder()
          .where("email = :email", {
            email: user.komuUserName,
          })
          .orWhere("username = :username", {
            username: user.komuUserName,
          })
          .andWhere(
            userOffFullday && userOffFullday.length > 0
              ? '"email" NOT IN (:...userOffFullday)'
              : "true",
            {
              userOffFullday: userOffFullday,
            }
          )
          .andWhere(`"deactive" IS NOT TRUE`)
          .select("*")
          .getRawOne();
        if (checkUser && checkUser !== null) {
          const userDiscord = await client.users.fetch(checkUser.userId);
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
    const result = await this.birthdayService.birthdayUser();
    try {
      await Promise.all(
        await result.map((item) => {
          this.komubotrestService.sendMessageToNhaCuaChung(
            client,
            `${item.wish} <@${item.user[0].userId}> +1 trà sữa full topping nhé b iu`
          );
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  async sendOdinReport(client) {
    try {
      const fetchChannel = await client.channels.fetch("925707563629150238");
      try {
        const date = new Date();

        if (isNaN(date.getTime())) {
          throw Error("invalid date provided");
        }

        const report = await this.odinReportService.getKomuWeeklyReport({
          reportName: "komu-weekly",
          url: process.env.ODIN_URL,
          username: process.env.ODIN_USERNAME,
          password: process.env.ODIN_PASSWORD,
          screenUrl: process.env.ODIN_KOMU_REPORT_WEEKLY_URL,
          date,
        });

        if (!report || !report.filePath) {
          throw new Error("requested report is not found");
        }

        const attachment = new AttachmentBuilder(report.filePath);
        const embed = new EmbedBuilder().setTitle("Komu report weekly");
        await fetchChannel
          .send({ files: [attachment], embed: embed })
          .catch(console.error);
      } catch (error) {
        console.error(error);
        fetchChannel.send(`Sorry, ${error.message}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async topTracker(client) {
    if (await this.utilsService.checkHoliday()) return;
    const userTracker = [
      "856211913456877608",
      "922416220056199198",
      "921689631110602792",
      "922297847876034562",
      "922306295346921552",
      "921601073939116073",
      "921261168088190997",
      "921312679354834984",
      "665925240404181002",
    ];
    await Promise.all(
      userTracker.map(async (user) => {
        const userDiscord = await client.users.fetch(user);
        userDiscord
          .send(`Nhớ bật top tracker <@${user}> nhé!!!`)
          .catch(console.error);
      })
    );
  }

  async sendReportWorkout(client) {
    const getPointWorkOut = await this.userRepository
      .createQueryBuilder("user")
      .innerJoin("komu_workout", "w", "user.userId = w.userId")
      .groupBy("w.userId")
      .addGroupBy("w.email")
      .addGroupBy("scores_workout")
      .select("w.email, scores_workout")
      .orderBy("scores_workout", "DESC")
      .execute();

    let mess;
    for (let i = 0; i <= Math.ceil(getPointWorkOut.length / 50); i += 1) {
      if (getPointWorkOut.slice(i * 50, (i + 1) * 50).length === 0) {
        break;
      }
      mess = getPointWorkOut
        .slice(i * 50, (i + 1) * 50)
        .map(
          (list) =>
            `${list.email.toLowerCase()} - point: ${list.scores_workout}`
        )
        .join("\n");
      const Embed = new EmbedBuilder()
        .setTitle("Top workout")
        .setColor("Red")
        .setDescription(`${mess}`);
      const userDiscord = await client.channels.fetch(
        this.clientConfigService.workoutChannelId
      );
      userDiscord.send({ embeds: [Embed] }).catch(console.error);
    }
  }

  async sendReportNotUpload(client) {
    const getUserNotUpload = await this.workoutRepository
      .createQueryBuilder("workout")
      .where(
        `"createdTimestamp" BETWEEN ${
          this.utilsService.getYesterdayDate() - 86400000
        } AND ${this.utilsService.getYesterdayDate()}`
      )
      .groupBy("workout.userId")
      .addGroupBy("workout.email")
      .select("workout.userId, workout.email")
      .orderBy("workout.email", "DESC")
      .execute();

    const getUserYesterday = await this.workoutRepository
      .createQueryBuilder("workout")
      .groupBy("workout.userId")
      .addGroupBy("workout.email")
      .select("workout.userId, workout.email")
      .orderBy("workout.email", "DESC")
      .execute();

    const results = getUserYesterday.filter(
      ({ email: id1 }) =>
        !getUserNotUpload.some(({ email: id2 }) => id2 === id1)
    );

    const resultsUserWorkout = getUserYesterday.filter(({ email: id1 }) =>
      getUserNotUpload.some(({ email: id2 }) => id2 === id1)
    );

    await Promise.all(
      resultsUserWorkout.map(async (item) => {
        const getUser = await this.userRepository.findOne({
          where: { userId: item.userId },
        });
        if (!getUser) return;

        await this.userRepository.update(
          {
            userId: item.userId,
          },
          {
            not_workout: 0,
          }
        );
      })
    );

    await Promise.all(
      results.map(async (item) => {
        const getUserId = await this.userRepository.findOne({
          where: { userId: item.userId },
        });
        if (!getUserId) return;

        let notWorkout;
        if (getUserId.not_workout) {
          notWorkout = getUserId.not_workout + 1;
        } else {
          notWorkout = 1;
        }

        let scrores;
        if (getUserId.scores_workout <= 1) {
          scrores = 0;
        } else {
          scrores = Math.round(+getUserId.scores_workout - 1);
        }

        await this.userRepository.update(
          {
            userId: item.userId,
          },
          {
            scores_workout: scrores,
            not_workout: notWorkout,
          }
        );
      })
    );

    if (results.length > 0) {
      const workoutUserEmail = results.map((item) => item.email);
      const getTotalUser = await this.userRepository
        .createQueryBuilder()
        .where(
          workoutUserEmail && workoutUserEmail.length > 0
            ? 'LOWER("email") IN (:...workoutUserEmail)'
            : "true",
          {
            workoutUserEmail: workoutUserEmail,
          }
        )
        .andWhere(`"scores_workout" >= :gtescores_workout`, {
          gtescores_workout: 1,
        })
        .orderBy("scores_workout", "DESC")
        .select("*")
        .execute();

      let mess;
      for (let i = 0; i <= Math.ceil(getTotalUser.length / 50); i += 1) {
        if (getTotalUser.slice(i * 50, (i + 1) * 50).length === 0) {
          break;
        }
        mess = getTotalUser
          .slice(i * 50, (i + 1) * 50)
          .map(
            (list) =>
              `${list.email.toLowerCase()} - point: ${list.scores_workout}`
          )
          .join("\n");
        const Embed = new EmbedBuilder()
          .setTitle("Danh sách không daily workout ngày hôm qua")
          .setColor("Red")
          .setDescription(`${mess}`);
        const userDiscord = await client.channels.fetch(
          this.clientConfigService.workoutChannelId
        );
        userDiscord.send({ embeds: [Embed] }).catch(console.error);
      }
    }
  }
}
