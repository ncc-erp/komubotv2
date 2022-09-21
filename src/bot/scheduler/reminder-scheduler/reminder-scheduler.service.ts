import { Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { Client } from "discord.js";
import { CronJob } from "cron";
import { UtilsService } from "src/bot/utils/utils.service";
import { Meeting } from "src/bot/models/meeting.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Remind } from "src/bot/models/remind.entity";

@Injectable()
export class ReminderSchedulerService {
  constructor(
    private utilsService: UtilsService,
    @InjectRepository(Meeting)
    private meetingReposistory: Repository<Meeting>,
    @InjectRepository(Remind)
    private remindReposistory: Repository<Remind>,
    private schedulerRegistry: SchedulerRegistry,
    @InjectDiscordClient()
    private client: Client
  ) {}

  private readonly logger = new Logger(ReminderSchedulerService.name);

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
    this.addCronJob("sendMessageReminder", "30 08 * * 0-6", () =>
      this.pingReminder(this.client)
    );
  }

  async sendMessageReminder(client, channelId, task, dateTime, mentionUserId) {
    const fetchChannel = await client.channels.fetch(channelId);
    if (mentionUserId) {
      const fetchUser = await client.users.fetch(mentionUserId);
      await fetchUser
        .send(`${fetchChannel.name}: ${task} - deadline: ${dateTime}`)
        .catch((err) => {});
    } else {
      if (fetchChannel.type === "GUILD_PUBLIC_THREAD") {
        fetchChannel.members.fetch().then((members) => {
          members.forEach(async (member) => {
            const fetchUser = await client.users.fetch(member.user.id);
            await fetchUser
              .send(`${fetchChannel.name}: ${task} - deadline: ${dateTime}`)
              .catch((err) => {});
          });
        });
      } else {
        fetchChannel.members.map(async (item) => {
          const fetchUserChannel = await client.users.fetch(item.user.id);
          await fetchUserChannel
            .send(`${fetchChannel.name}: ${task} - deadline: ${dateTime}`)
            .catch((err) => {});
        });
      }
    }
  }

  async pingReminder(client) {
    if (await this.utilsService.checkHoliday()) return;
    const remindLists = await this.remindReposistory
      .createQueryBuilder("remind")
      .where("createdTimestamp >= :gtecreatedTimestamp", {
        gtecreatedTimestamp: this.utilsService.getYesterdayDate(),
      })
      .andWhere("createdTimestamp >= :ltecreatedTimestamp", {
        ltecreatedTimestamp: this.utilsService.getTomorrowDate(),
      })
      .select("remind.*")
      .execute();

    const meetingLists = await this.meetingReposistory
      .createQueryBuilder("meeting")
      .where(`"reminder" IS NOT TRUE`)
      .andWhere(`"cancel" IS NOT TRUE`)
      .select("meeting.*")
      .execute();

    const listMeetingAndRemind = meetingLists.concat(remindLists);
    const lists = listMeetingAndRemind.sort(
      (a, b) => +a.createdTimestamp.toString() - +b.createdTimestamp.toString()
    );
    if (lists.length !== 0) {
      lists.map(async (item) => {
        const dateScheduler = new Date(+item.createdTimestamp);

        const dateCreatedTimestamp = new Date(
          +item.createdTimestamp.toString()
        ).toLocaleDateString("en-US");

        const newDateTimestamp = new Date(+item.createdTimestamp.toString());
        const currentDate = new Date(newDateTimestamp.getTime());
        const today = new Date();
        currentDate.setDate(today.getDate());
        currentDate.setMonth(today.getMonth());
        const dateTime = this.utilsService.formatDateTimeReminder(
          new Date(Number(item.createdTimestamp))
        );
        switch (item.repeat) {
          case "once":
            if (this.utilsService.isSameDate(dateCreatedTimestamp)) {
              await this.sendMessageReminder(
                client,
                item.channelId,
                item.task,
                dateTime,
                null
              );
            }
            return;
          case "daily":
            if (this.utilsService.isSameDay()) return;
            await this.sendMessageReminder(
              client,
              item.channelId,
              item.task,
              dateTime,
              null
            );
            return;
          case "weekly":
            if (
              this.utilsService.isDiffDay(dateScheduler, 7) &&
              this.utilsService.isTimeDay(dateScheduler)
            ) {
              await this.sendMessageReminder(
                client,
                item.channelId,
                item.task,
                dateTime,
                null
              );
            }
            return;
          case "repeat":
            if (
              this.utilsService.isDiffDay(dateScheduler, item.repeatTime) &&
              this.utilsService.isTimeDay(dateScheduler)
            ) {
              await this.sendMessageReminder(
                client,
                item.channelId,
                item.task,
                dateTime,
                null
              );
            }
            return;
          default:
            await this.sendMessageReminder(
              client,
              item.channelId,
              item.content,
              dateTime,
              item.mentionUserId
            );
        }
      });
    }
  }

  async sendMesageRemind(client) {
    try {
      if (await this.utilsService.checkHoliday()) return;
      const data = await this.remindReposistory.find({
        where: { cancel: false },
      });

      const now = new Date();
      now.setHours(now.getHours() + 7);
      const hourDateNow = now.getHours();
      const dateNow = now.toLocaleDateString("en-US");
      const minuteDateNow = now.getMinutes();

      data.map(async (item) => {
        let checkFiveMinute;
        let hourTimestamp;

        const dateScheduler = new Date(+item.createdTimestamp);
        const minuteDb = dateScheduler.getMinutes();

        if (minuteDb >= 0 && minuteDb <= 4) {
          checkFiveMinute = minuteDb + 60 - minuteDateNow;
          const hourDb = dateScheduler;
          const setHourTimestamp = hourDb.setHours(hourDb.getHours() - 1);
          hourTimestamp = new Date(setHourTimestamp).getHours();
        } else {
          checkFiveMinute = minuteDb - minuteDateNow;
          hourTimestamp = dateScheduler.getHours();
        }

        const dateCreatedTimestamp = new Date(
          +item.createdTimestamp.toString()
        ).toLocaleDateString("en-US");

        if (
          hourDateNow === hourTimestamp &&
          0 <= checkFiveMinute &&
          checkFiveMinute <= 5 &&
          dateCreatedTimestamp === dateNow
        ) {
          const fetchChannel = await client.channels.fetch(item.channelId);
          fetchChannel
            .send(
              `<@${item.mentionUserId}>, due today ${item.content} of <@${item.authorId}>`
            )
            .catch(console.error);
          await this.remindReposistory.update(
            { id: item.id },
            { cancel: true }
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
