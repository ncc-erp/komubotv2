
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Meeting } from "../../models/meeting.entity";
import { VoiceChannels } from "../../models/voiceChannel.entity";
import { UtilsService } from "../../utils/utils.service";
import { CronJob } from "cron";
import { SchedulerRegistry, CronExpression } from "@nestjs/schedule";
import { ChannelType, Client } from "discord.js";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { isFirstDayOfMonth, isLastDayOfMonth, isSameDay } from "date-fns";

@Injectable()
export class MeetingSchedulerService {
  constructor(
    private utilsService: UtilsService,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
    @InjectRepository(VoiceChannels)
    private voiceChannelRepository: Repository<VoiceChannels>,
    private schedulerRegistry: SchedulerRegistry,
    private configClient: ClientConfigService,
    @InjectDiscordClient()
    private client: Client
  ) {}

  private readonly logger = new Logger(MeetingSchedulerService.name);

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
    this.addCronJob("tagMeeting", CronExpression.EVERY_MINUTE, () =>
      this.tagMeeting(this.client)
    );
    this.addCronJob("updateReminderMeeting", CronExpression.EVERY_MINUTE, () =>
      this.updateReminderMeeting()
    );
  }

  async tagMeeting(client: Client) {
    if (await this.utilsService.checkHoliday()) return;

    const getAllVoice = await this.getAllVoiceChannels(client);
    const repeatMeet = await this.getValidMeetings();

    const voiceNow = await this.getActiveVoiceChannels();

    const { countVoice, roomVoice } = await this.getCountAndRooms(
      getAllVoice,
      voiceNow,
      client
    );

    await this.checkAndSendNotifications(
      client,
      repeatMeet,
      countVoice,
      getAllVoice,
      roomVoice
    );
  }

  async getAllVoiceChannels(client: Client) {
    await client.guilds.fetch(this.configClient.guild_komu_id);
    return client.channels.cache.filter(
      (channel) =>
        channel.type === ChannelType.GuildVoice &&
        channel.parentId === this.configClient.guildvoice_parent_id
    );
  }

  async getValidMeetings() {
    return await this.meetingRepository
      .createQueryBuilder("meeting")
      .where(`"reminder" IS NOT TRUE`)
      .andWhere(`"cancel" IS NOT TRUE`)
      .select("meeting.*")
      .execute();
  }

  async getActiveVoiceChannels() {
    const activeVoiceChannels = await this.voiceChannelRepository.find({
      where: {
        status: "start",
      },
    });

    return activeVoiceChannels.map((item) => item.voiceChannelId);
  }

  async getCountAndRooms(
    allVoiceChannels,
    activeVoiceChannels,
    client: Client
  ) {
    let countVoice = 0;
    let roomVoice = [];

    await allVoiceChannels.forEach(async (channel) => {
      const userDiscord: any = await client.channels.fetch(channel.id);

      if (userDiscord.members.size > 0) {
        countVoice++;
      } else {
        roomVoice.push(channel.id);
      }
    });

    roomVoice = roomVoice.filter((room) => !activeVoiceChannels.includes(room));

    return { countVoice, roomVoice };
  }

  async checkAndSendNotifications(
    client,
    repeatMeet,
    countVoice,
    getAllVoice,
    roomVoice
  ) {
    for (const data of repeatMeet) {
      const dateScheduler = new Date(+data.createdTimestamp);
      const minuteDb = dateScheduler.getMinutes();
      const dateCreatedTimestamp = new Date(
        +data.createdTimestamp.toString()
      ).toLocaleDateString("en-US");

      if (
        countVoice === getAllVoice.length &&
        this.utilsService.isSameMinute(minuteDb, dateScheduler) &&
        this.utilsService.isSameDate(dateCreatedTimestamp)
      ) {
        const fetchChannelFull = await client.channels.fetch(data.channelId);
        await fetchChannelFull
          .send(`@here voice channel full`)
          .catch(console.error);
      } else {
        await this.handleMeetingRepeat(
          data,
          roomVoice,
          dateCreatedTimestamp,
          client,
          dateScheduler,
          minuteDb
        );
      }
    }
  }

  async handleMeetingRepeat(
    data,
    roomVoice,
    dateCreatedTimestamp,
    client,
    dateScheduler,
    minuteDb
  ) {
    const newDateTimestamp = new Date(+data.createdTimestamp.toString());
    const currentDate = new Date(newDateTimestamp.getTime());
    const today = new Date();
    currentDate.setDate(today.getDate());
    currentDate.setMonth(today.getMonth());

    switch (data.repeat) {
      case "once":
        await this.handleOnceMeeting(
          data,
          roomVoice,
          dateCreatedTimestamp,
          client,
          dateScheduler,
          minuteDb
        );
        break;
      case "daily":
        await this.handleDailyMeeting(
          data,
          roomVoice,
          currentDate,
          client,
          dateScheduler,
          minuteDb
        );
        break;
      case "weekly":
        await this.handleWeeklyMeeting(
          data,
          roomVoice,
          currentDate,
          client,
          dateScheduler,
          minuteDb
        );
        break;
      case "repeat":
        await this.handleRepeatMeeting(
          data,
          roomVoice,
          currentDate,
          client,
          dateScheduler,
          minuteDb
        );
        break;
      case "monthly":
        await this.handleMonthlyMeeting(
          data,
          roomVoice,
          today,
          client,
          dateScheduler,
          minuteDb
        );
        break;
      default:
        break;
    }
  }

  async handleOnceMeeting(
    data,
    roomVoice,
    dateCreatedTimestamp,
    client,
    dateScheduler,
    minuteDb
  ) {
    if (
      this.utilsService.isSameDate(dateCreatedTimestamp) &&
      this.utilsService.isSameMinute(minuteDb, dateScheduler)
    ) {
      let onceFetchChannel;
      try {
        onceFetchChannel = await client.channels.fetch(data.channelId);
      } catch (error) {
        console.error('handleOnceMeeting: channel not found');
      }
      if (!onceFetchChannel) {
        return;
      }
      await this.handleRenameVoiceChannel(
        roomVoice,
        onceFetchChannel,
        client,
        data
      );
      await this.meetingRepository
        .createQueryBuilder()
        .update(Meeting)
        .set({ reminder: true })
        .where('"id" = :id', { id: data.id })
        .execute()
        .catch(console.error);
    }
  }

  async handleDailyMeeting(
    data,
    roomVoice,
    currentDate,
    client,
    dateScheduler,
    minuteDb
  ) {
      if (this.utilsService.isSameDay()) return;
    if (
      this.utilsService.isSameMinute(minuteDb, dateScheduler) &&
      this.utilsService.isTimeDay(dateScheduler)
    ) {
        let dailyFetchChannel;
        try {
          dailyFetchChannel = await client.channels.fetch(data.channelId);
        } catch (error) {
          console.error('handleDailyMeeting: channel not found');
        }
        if (!dailyFetchChannel) {
         return; 
        }
        await this.handleRenameVoiceChannel(
          roomVoice,
          dailyFetchChannel,
          client,
          data
        );
      let newCreatedTimestamp = data.createdTimestamp;
      newCreatedTimestamp = currentDate.setDate(currentDate.getDate() + 1);

      while (await this.utilsService.checkHolidayMeeting(currentDate)) {
        newCreatedTimestamp = currentDate.setDate(currentDate.getDate() + 1);

        while (await this.utilsService.checkHolidayMeeting(currentDate)) {
          newCreatedTimestamp = currentDate.setDate(currentDate.getDate() + 1);
        }

        await this.meetingRepository
          .createQueryBuilder()
          .update(Meeting)
          .set({ reminder: true, createdTimestamp: newCreatedTimestamp })
          .where('"id" = :id', { id: data.id })
          .execute()
          .catch(console.error);

        const findMeetingAfter = await this.meetingRepository.find({
          where: {
            channelId: data.channelId,
            task: data.task,
            repeat: data.repeat,
          },
        });
        console.log(findMeetingAfter, "findMeetingAfterUpdate");
      }
  }

  async handleWeeklyMeeting(
    data,
    roomVoice,
    currentDate,
    client,
    dateScheduler,
    minuteDb
  ) {
    if (
      this.utilsService.isSameMinute(minuteDb, dateScheduler) &&
      this.utilsService.isDiffDay(dateScheduler, 7) &&
      this.utilsService.isTimeDay(dateScheduler)
    ) {
      let weeklyFetchChannel;
      try {
        weeklyFetchChannel = await client.channels.fetch(data.channelId);
      } catch (error) {
        console.log('handleWeeklyMeeting: channel not found');
      }
      if (!weeklyFetchChannel) {
        return;
      }
      await this.handleRenameVoiceChannel(
        roomVoice,
        weeklyFetchChannel,
        client,
        data
      );

      let newCreatedTimestampWeekly = data.createdTimestamp;
      newCreatedTimestampWeekly = currentDate.setDate(
        currentDate.getDate() + 7
      );
      while (await this.utilsService.checkHolidayMeeting(currentDate)) {
        newCreatedTimestampWeekly = currentDate.setDate(
          currentDate.getDate() + 7
        );
      }
      await this.meetingRepository
        .createQueryBuilder()
        .update(Meeting)
        .set({ reminder: true, createdTimestamp: newCreatedTimestampWeekly })
        .where('"id" = :id', { id: data.id })
        .execute()
        .catch(console.error);
    }
  }

  async handleRepeatMeeting(
    data,
    roomVoice,
    currentDate,
    client,
    dateScheduler,
    minuteDb
  ) {
    if (
      this.utilsService.isSameMinute(minuteDb, dateScheduler) &&
      this.utilsService.isDiffDay(dateScheduler, +data.repeatTime) &&
      this.utilsService.isTimeDay(dateScheduler)
    ) {
      let repeatFetchChannel;
      try {
        repeatFetchChannel = await client.channels.fetch(data.channelId);
      } catch (error) {
        console.error('handleRepeatMeeting: channel not found');
      }
      if (!repeatFetchChannel) {
        return;
      }
      await this.handleRenameVoiceChannel(
        roomVoice,
        repeatFetchChannel,
        client,
        data
      );

      let newCreatedTimestampRepeat = data.createdTimestamp;
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + +data.repeatTime);
      newCreatedTimestampRepeat = newDate.getTime();
      while (await this.utilsService.checkHolidayMeeting(currentDate)) {
        newCreatedTimestampRepeat = newDate.setDate(
          newDate.getDate() + +data.repeatTime
        );
      }
      await this.meetingRepository
        .createQueryBuilder()
        .update(Meeting)
        .set({ reminder: true, createdTimestamp: newCreatedTimestampRepeat })
        .where('"id" = :id', { id: data.id })
        .execute()
        .catch(console.error);
    }
  }

  async handleMonthlyMeeting(
    data,
    roomVoice,
    today,
    client,
    dateScheduler,
    minuteDb
  ) {
    if (this.utilsService.isSameDay()) {
      return;
    }

    if (
      this.utilsService.isSameMinute(minuteDb, dateScheduler) &&
      this.utilsService.isTimeDay(dateScheduler)
    ) {
      const isRepeatFirst = data.repeatTime === "first";
      const isRepeatLast = data.repeatTime === "last";
      const isRepeatMonthly = !isRepeatFirst && !isRepeatLast;

      today.setHours(today.getHours() + 7);
      const isCurrentMonthFirstDay = isFirstDayOfMonth(today);
      const isCurrentMonthLastDay = isLastDayOfMonth(today);
      const isCurrentDateScheduler =
        today.getDate() === dateScheduler.getDate();

      if (
        (isRepeatFirst && isCurrentMonthFirstDay) ||
        (isRepeatLast && isCurrentMonthLastDay) ||
        (isRepeatMonthly && isCurrentDateScheduler)
      ) {
        let monthlyFetchChannel;
        try {
          monthlyFetchChannel = await client.channels.fetch(data.channelId);
        } catch (error) {
          console.error('handleMonthlyMeeting: channel not found');
        }
        if (!monthlyFetchChannel) {
          return;
        }

        await this.handleRenameVoiceChannel(
          roomVoice,
          monthlyFetchChannel,
          client,
          data
        );

        await this.meetingRepository
          .createQueryBuilder()
          .update(Meeting)
          .set({ reminder: true })
          .where('"id" = :id', { id: data.id })
          .execute()
          .catch(console.error);
      }
    }
  }

  async handleRenameVoiceChannel(roomVoice, channel, client, data) {
    if(data.task.includes("https")) {
      await channel.send(`@here our meeting room is ${data.task}`)
      .catch(console.error);
      return;
    }
    if (roomVoice.length !== 0) {
      await channel
        .send(`@here our meeting room is <#${roomVoice[0]}>`)
        .catch(console.error);
      const voiceRemove = roomVoice.shift(roomVoice[0]);
      const voiceChannel = await client.channels.fetch(voiceRemove);
      let originalName = voiceChannel.name;
      const searchTerm = "(";
      const indexOfFirst = originalName.indexOf(searchTerm);
      if (indexOfFirst > 0) {
        originalName = originalName.slice(0, indexOfFirst - 1);
        await voiceChannel.setName(`${originalName} (${data.task})`);
      } else {
        await voiceChannel.setName(`${voiceChannel.name} (${data.task})`);
      }
      const newRoom = voiceChannel.name;
      await this.voiceChannelRepository
        .insert({
          voiceChannelId: voiceChannel.id,
          originalName: originalName,
          newRoomName: newRoom,
          createdTimestamp: Date.now(),
        })
        .catch((err) => console.log(err));
    } else {
      await channel.send(`@here voice channel full`).catch(console.error);
    }
  }

  async updateReminderMeeting() {
    if (await this.utilsService.checkHoliday()) return;
    const repeatMeet = await this.meetingRepository.find({
      where: {
        reminder: true,
      },
    });

    const dateTimeNow = new Date();
    dateTimeNow.setHours(dateTimeNow.getHours());
    const hourDateNow = dateTimeNow.getHours();
    const minuteDateNow = dateTimeNow.getMinutes();

    repeatMeet.map(async (item) => {
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
        checkFiveMinute = minuteDateNow - minuteDb;
        hourTimestamp = dateScheduler.getHours();
      }
      if (hourDateNow === hourTimestamp && checkFiveMinute > 1) {
        if (item.repeat === "once") {
          await this.meetingRepository.update(
            { id: item.id },
            { cancel: true }
          );
        } else {
          await this.meetingRepository.update(
            { id: item.id },
            { reminder: false }
          );
        }
      }
    });
  }
}
