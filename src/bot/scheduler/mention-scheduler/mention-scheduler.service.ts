import { InjectDiscordClient } from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { ChannelType, Client } from "discord.js";
import { UtilsService } from "src/bot/utils/utils.service";
import { CronJob } from "cron";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Mentioned } from "src/bot/models/mentioned.entity";
import moment from "moment";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { User } from "src/bot/models/user.entity";
import { ClientConfigService } from "src/bot/config/client-config.service";

@Injectable()
export class MentionSchedulerService {
  constructor(
    private utilsService: UtilsService,
    @InjectRepository(Mentioned)
    private mentionRepository: Repository<Mentioned>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WorkFromHome)
    private wfhRepository: Repository<WorkFromHome>,
    private schedulerRegistry: SchedulerRegistry,
    @InjectDiscordClient()
    private client: Client,
    private komubotrestService: KomubotrestService,
    private clientConfig: ClientConfigService
  ) {}

  private readonly logger = new Logger(MentionSchedulerService.name);

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
    this.addCronJob("checkMention", "*/1 9-11,13-17 * * 1-5", () =>
      this.checkMention(this.client)
    );
  }

  async notifyUser(client, user) {
    const mentionChannel = await client.channels.fetch(user.channelId);
    const threadNoti = mentionChannel.type !== ChannelType.GuildText;
    const message = await mentionChannel.messages.fetch(user.messageId);
    const mentionName = await client.users.fetch(user.authorId);
    const userDiscord = await client.users.fetch(user.mentionUserId);

    userDiscord
      .send(
        `Hãy trả lời ${mentionName.username} tại ${
          threadNoti ? "thread" : "channel"
        } ${message.url} nhé!`
      )
      .catch(console.error);

    await this.mentionRepository.update({ id: user.id }, { noti: true });
  }

  async processNotiUsers(client, mentionedUsers) {
    const millisecondsOfTwentyfiveMinutes = 1500000;
    const millisecondsOfThirtyMinutes = 1800000;
    const dateNow = Date.now();
    const notiUser = mentionedUsers.filter(
      (item) =>
        dateNow - item.createdTimestamp >= millisecondsOfTwentyfiveMinutes &&
        dateNow - item.createdTimestamp < millisecondsOfThirtyMinutes &&
        !item.noti
    );

    await Promise.all(
      notiUser.map(async (user) => {
        await this.notifyUser(client, user);
      })
    );

    const filteredMentionedUsers = mentionedUsers.filter(
      (item) => dateNow - item.createdTimestamp >= millisecondsOfThirtyMinutes
    );

    return filteredMentionedUsers;
  }

  async createWFHWarning(client, user, mentionChannel, thread, channelName) {
    let content;
    thread
      ? (content = `<@${
          user.mentionUserId
        }> không trả lời tin nhắn mention của <@${user.authorId}> lúc ${moment(
          parseInt(user.createdTimestamp.toString())
        )
          .utcOffset(420)
          .format("YYYY-MM-DD HH:mm:ss")} tại thread ${channelName} (${
          mentionChannel.name
        })!\n`)
      : (content = `<@${
          user.mentionUserId
        }> không trả lời tin nhắn mention của <@${user.authorId}> lúc ${moment(
          parseInt(user.createdTimestamp.toString())
        )
          .utcOffset(420)
          .format("YYYY-MM-DD HH:mm:ss")} tại channel ${
          mentionChannel.name
        }!\n`);

    const findUser = await this.userRepository.findOne({
      where: { userId: user.mentionUserId },
    });

    const data = await this.wfhRepository.save({
      user: findUser,
      wfhMsg: content,
      complain: false,
      pmconfirm: false,
      status: "ACTIVE",
      type: "mention",
      createdAt: Date.now(),
    });

    const message = this.komubotrestService.getWFHWarninghMessage(
      content,
      user.mentionUserId,
      data.id.toString()
    );

    const channel = await client.channels.fetch(
      this.clientConfig.machleoChannelId
    );

    await channel.send(message).catch(console.error);
    await this.mentionRepository.update(
      { id: user.id },
      { confirm: true, punish: true }
    );
  }

  async processMentionedUsers(client, mentionedUsers) {
    await Promise.all(
      mentionedUsers.map(async (user) => {
        let thread = false;
        let mentionChannel = await client.channels
          .fetch(user.channelId)
          .catch((err) => {});

        if (!mentionChannel) return;

        const channelName = mentionChannel.name;
        if (mentionChannel.type !== ChannelType.GuildText) {
          thread = true;
          mentionChannel = await client.channels
            .fetch(mentionChannel.parentId)
            .catch((err) => {});
        }

        await this.createWFHWarning(
          client,
          user,
          mentionChannel,
          thread,
          channelName
        );
      })
    );
  }

  async checkMention(client) {
    if (await this.utilsService.checkHoliday()) return;
    if (this.utilsService.checkTime(new Date())) return;

    try {
      let mentionedUsers = await this.mentionRepository.find({
        where: { confirm: false },
      });

      const filteredMentionedUsers = await this.processNotiUsers(
        client,
        mentionedUsers
      );

      await this.processMentionedUsers(client, filteredMentionedUsers);
    } catch (error) {
      console.log(error);
    }
  }
}
