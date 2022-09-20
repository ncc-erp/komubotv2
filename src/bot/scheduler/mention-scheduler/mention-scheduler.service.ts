import { InjectDiscordClient } from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { Client } from "discord.js";
import { UntilService } from "src/bot/untils/until.service";
import { CronJob } from "cron";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Mentioned } from "src/bot/models/mentioned.entity";
import moment from "moment";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { getWFHWarninghMessage } from "src/bot/untils/komu.until";

@Injectable()
export class MentionSchedulerService {
  constructor(
    private untilService: UntilService,
    @InjectRepository(Mentioned)
    private mentionReposistory: Repository<Mentioned>,
    @InjectRepository(WorkFromHome)
    private wfhReposistory: Repository<WorkFromHome>,
    private schedulerRegistry: SchedulerRegistry,
    @InjectDiscordClient()
    private client: Client
  ) {}

  private readonly logger = new Logger(MentionSchedulerService.name);

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

  async checkMention(client) {
    if (await this.untilService.checkHoliday()) return;
    if (this.untilService.checkTime(new Date())) return;
    const now = Date.now();
    try {
      let mentionedUsers = await this.mentionReposistory.find({
        where: { confirm: false },
      });
      const notiUser = mentionedUsers.filter(
        (item) =>
          now - item.createdTimestamp >= 1500000 &&
          now - item.createdTimestamp < 1800000 &&
          !item.noti
      );

      mentionedUsers = mentionedUsers.filter(
        (item) => now - item.createdTimestamp >= 1800000
      );

      await Promise.all(
        notiUser.map(async (user) => {
          let mentionChannel = await client.channels.fetch(user.channelId);
          if (mentionChannel.type !== "GUILD_TEXT") {
            mentionChannel = await client.channels.fetch(
              mentionChannel.parentId
            );
          }

          let mentionName = await client.users.fetch(user.authorId);

          const userDiscord = await client.users.fetch(user.mentionUserId);
          userDiscord
            .send(
              `Hãy trả lời ${mentionName.username} tại channel ${mentionChannel.name} nhé!`
            )
            .catch(console.error);
          await this.mentionReposistory.update({ id: user.id }, { noti: true });
        })
      );

      await Promise.all(
        mentionedUsers.map(async (user) => {
          let mentionChannel = await client.channels.fetch(user.channelId);
          if (mentionChannel.type !== "GUILD_TEXT") {
            mentionChannel = await client.channels.fetch(
              mentionChannel.parentId
            );
          }
          const content = `<@${
            user.mentionUserId
          }> không trả lời tin nhắn mention của <@${
            user.authorId
          }> lúc ${moment(parseInt(user.createdTimestamp.toString()))
            .utcOffset(420)
            .format("YYYY-MM-DD HH:mm:ss")} tại channel ${
            mentionChannel.name
          }!\n`;
          const data = await this.wfhReposistory.insert({
            userid: user.mentionUserId,
            wfhMsg: content,
            complain: false,
            pmconfirm: false,
            status: "ACTIVE",
            type: "mention",
          });
          const message = getWFHWarninghMessage(
            content,
            user.mentionUserId,
            "data.id.toString()"
          );
          const channel = await client.channels.fetch(
            process.env.KOMUBOTREST_MACHLEO_CHANNEL_ID
          );
          await channel.send(message).catch(console.error);
          await this.mentionReposistory.update(
            { id: user.id },
            { confirm: true, punish: true }
          );
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}
