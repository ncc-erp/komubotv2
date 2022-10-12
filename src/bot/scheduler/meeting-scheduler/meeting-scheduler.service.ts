import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Meeting } from "../../models/meeting.entity";
import { VoiceChannels } from "../../models/voiceChannel.entity";
import { UtilsService } from "../../utils/utils.service";
import { CronJob } from "cron";
import { SchedulerRegistry, CronExpression } from "@nestjs/schedule";
import { Client } from "discord.js";
import { InjectDiscordClient } from "@discord-nestjs/core";

@Injectable()
export class MeetingSchedulerService {
  constructor(
    private utilsService: UtilsService,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
    @InjectRepository(VoiceChannels)
    private voiceChannelRepository: Repository<VoiceChannels>,
    private schedulerRegistry: SchedulerRegistry,
    @InjectDiscordClient()
    private client: Client
  ) {}

  private readonly logger = new Logger(MeetingSchedulerService.name);

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
    this.addCronJob("tagMeeting", CronExpression.EVERY_MINUTE, () =>
      this.tagMeeting(this.client)
    );
    this.addCronJob("updateReminderMeeting", CronExpression.EVERY_MINUTE, () =>
      this.updateReminderMeeting()
    );
  }

  async tagMeeting(client: any) {
    if (await this.utilsService.checkHoliday()) return;
    let guild = client.guilds.fetch("921239248991055882");
    const getAllVoice = client.channels.cache.filter(
      (guild) =>
        guild.type === ("2" as any) && guild.parentId === "921239248991055884"
    );
    const repeatMeet = await this.meetingRepository
      .createQueryBuilder("meeting")
      .where(`"reminder" IS NOT TRUE`)
      .andWhere(`"cancel" IS NOT TRUE`)
      .select("meeting.*")
      .execute();

    const voiceChannel = getAllVoice.map((item) => item.id);

    let countVoice = 0;
    let roomMap = [];
    let voiceNow = [];

    const findVoice = await this.voiceChannelRepository.find({
      where: {
        status: "start",
      },
    });
    findVoice.map((item) => {
      voiceNow.push(item.voiceChannelId);
    });

    voiceChannel.map(async (voice, index) => {
      const userDiscord = await client.channels.fetch(voice);

      if (userDiscord.members.size > 0) {
        countVoice++;
      }
      if (userDiscord.members.size === 0) {
        roomMap.push(userDiscord.id);
      }
      let roomVoice: any = roomMap.filter((room) => !voiceNow.includes(room));

      if (index === voiceChannel.length - 1) {
        const timeCheck = repeatMeet.map(async (item) => {
          const dateScheduler = new Date(+item.createdTimestamp);
          const minuteDb = dateScheduler.getMinutes();

          const dateCreatedTimestamp = new Date(
            +item.createdTimestamp.toString()
          ).toLocaleDateString("en-US");
          if (
            countVoice === voiceChannel.length &&
            this.utilsService.isSameMinute(minuteDb, dateScheduler) &&
            this.utilsService.isSameDate(dateCreatedTimestamp)
          ) {
            const fetchChannelFull = await client.channels.fetch(
              item.channelId
            );
            await fetchChannelFull
              .send(`@here voice channel full`)
              .catch(console.error);
          } else {
            const newDateTimestamp = new Date(
              +item.createdTimestamp.toString()
            );
            const currentDate = new Date(newDateTimestamp.getTime());
            const today = new Date();
            currentDate.setDate(today.getDate());
            currentDate.setMonth(today.getMonth());
            switch (item.repeat) {
              case "once":
                if (
                  this.utilsService.isSameDate(dateCreatedTimestamp) &&
                  this.utilsService.isSameMinute(minuteDb, dateScheduler)
                ) {
                  const onceFetchChannel = await client.channels.fetch(
                    item.channelId
                  );
                  if (roomVoice.length !== 0) {
                    onceFetchChannel
                      .send(`@here our meeting room is <#${roomVoice[0]}>`)
                      .catch(console.error);
                    const onceShift = roomVoice.shift(roomVoice[0]);
                    const channelNameOnce = await client.channels.fetch(
                      onceShift
                    );
                    let originalNameOnce = channelNameOnce.name;
                    const searchTermOnce = "(";
                    const indexOfFirstOnce =
                      originalNameOnce.indexOf(searchTermOnce);
                    if (indexOfFirstOnce > 0) {
                      originalNameOnce = originalNameOnce.slice(
                        0,
                        indexOfFirstOnce - 1
                      );
                      await channelNameOnce.setName(
                        `${originalNameOnce} (${item.task})`
                      );
                    } else
                      await channelNameOnce.setName(
                        `${channelNameOnce.name} (${item.task})`
                      );
                    const newRoomOnce = channelNameOnce.name;
                    await this.voiceChannelRepository
                      .insert({
                        voiceChannelId: channelNameOnce.id,
                        originalName: originalNameOnce,
                        newRoomName: newRoomOnce,
                        createdTimestamp: Date.now(),
                      })
                      .catch((err) => console.log(err));
                  } else
                    await onceFetchChannel
                      .send(`@here voice channel full`)
                      .catch(console.error);
                  await this.meetingRepository
                    .createQueryBuilder()
                    .update(Meeting)
                    .set({ reminder: true })
                    .where('"id" = :id', { id: item.id })
                    .execute()
                    .catch(console.error);
                }
                return;
              case "daily":
                if (this.utilsService.isSameDay()) return;
                if (this.utilsService.isSameMinute(minuteDb, dateScheduler)) {
                  const dailyFetchChannel = await client.channels.fetch(
                    item.channelId
                  );
                  if (roomVoice.length !== 0) {
                    dailyFetchChannel
                      .send(`@here our meeting room is <#${roomVoice[0]}>`)
                      .catch(console.error);
                    const dailyShift = roomVoice.shift(roomVoice[0]);
                    const channelNameDaily = await client.channels.fetch(
                      dailyShift
                    );
                    let originalNameDaily = channelNameDaily.name;
                    const searchTermDaily = "(";
                    const indexOfFirstDaily =
                      originalNameDaily.indexOf(searchTermDaily);
                    if (indexOfFirstDaily > 0) {
                      originalNameDaily = originalNameDaily.slice(
                        0,
                        indexOfFirstDaily - 1
                      );
                      await channelNameDaily.setName(
                        `${originalNameDaily} (${item.task})`
                      );
                    } else
                      await channelNameDaily.setName(
                        `${channelNameDaily.name} (${item.task})`
                      );
                    console.log(`setname ${item.task} daily ${item.channelId}`);
                    const newRoomDaily = channelNameDaily.name;
                    await this.voiceChannelRepository
                      .insert({
                        voiceChannelId: channelNameDaily.id,
                        originalName: originalNameDaily,
                        newRoomName: newRoomDaily,
                        createdTimestamp: Date.now(),
                      })
                      .catch((err) => console.log(err));
                    console.log(
                      `wait for update ${item.task} daily ${item.channelId}`
                    );
                  } else
                    await dailyFetchChannel
                      .send(`@here voice channel full`)
                      .catch(console.error);

                  let newCreatedTimestamp = item.createdTimestamp;
                  newCreatedTimestamp = currentDate.setDate(
                    currentDate.getDate() + 1
                  );

                  while (
                    await this.utilsService.checkHolidayMeeting(currentDate)
                  ) {
                    newCreatedTimestamp = currentDate.setDate(
                      currentDate.getDate() + 1
                    );
                  }
                  console.log(
                    `checkholiday set timestamp ${item.task} ${item.channelId}`
                  );
                  await this.meetingRepository
                    .createQueryBuilder()
                    .update(Meeting)
                    .set({
                      reminder: true,
                      createdTimestamp: newCreatedTimestamp,
                    })
                    .where('"id" = :id', { id: item.id })
                    .execute()
                    .catch(console.error);
                  console.log(
                    `update daily ${item.task} successfully ${item.channelId}`
                  );

                  const findMeetingAfter = await this.meetingRepository.find({
                    where: {
                      channelId: item.channelId,
                      task: item.task,
                      repeat: item.repeat,
                    },
                  });
                  console.log(findMeetingAfter, "findMeetingAfterUpdate");
                }
                return;
              case "weekly":
                if (
                  this.utilsService.isSameMinute(minuteDb, dateScheduler) &&
                  this.utilsService.isDiffDay(dateScheduler, 7) &&
                  this.utilsService.isTimeDay(dateScheduler)
                ) {
                  const weeklyFetchChannel = await client.channels.fetch(
                    item.channelId
                  );
                  if (roomVoice.length !== 0) {
                    weeklyFetchChannel
                      .send(`@here our meeting room is <#${roomVoice[0]}>`)
                      .catch(console.error);
                    const weeklyShift = roomVoice.shift(roomVoice[0]);
                    const channelNameWeekly = await client.channels.fetch(
                      weeklyShift
                    );
                    let originalNameWeekly = channelNameWeekly.name;
                    const searchTermWeekly = "(";
                    const indexOfFirstWeekly =
                      originalNameWeekly.indexOf(searchTermWeekly);
                    if (indexOfFirstWeekly > 0) {
                      originalNameWeekly = originalNameWeekly.slice(
                        0,
                        indexOfFirstWeekly - 1
                      );
                      await channelNameWeekly.setName(
                        `${originalNameWeekly} (${item.task})`
                      );
                    } else
                      await channelNameWeekly.setName(
                        `${channelNameWeekly.name} (${item.task})`
                      );
                    const newRoomWeekly = channelNameWeekly.name;
                    await this.voiceChannelRepository
                      .insert({
                        voiceChannelId: channelNameWeekly.id,
                        originalName: originalNameWeekly,
                        newRoomName: newRoomWeekly,
                        createdTimestamp: Date.now(),
                      })
                      .catch((err) => console.log(err));
                  } else
                    await weeklyFetchChannel
                      .send(`@here voice channel full`)
                      .catch(console.error);
                  let newCreatedTimestampWeekly = item.createdTimestamp;
                  newCreatedTimestampWeekly = currentDate.setDate(
                    currentDate.getDate() + 7
                  );
                  while (
                    await this.utilsService.checkHolidayMeeting(currentDate)
                  ) {
                    newCreatedTimestampWeekly = currentDate.setDate(
                      currentDate.getDate() + 7
                    );
                  }
                  await this.meetingRepository
                    .createQueryBuilder()
                    .update(Meeting)
                    .set({
                      reminder: true,
                      createdTimestamp: newCreatedTimestampWeekly,
                    })
                    .where('"id" = :id', { id: item.id })
                    .execute()
                    .catch(console.error);
                }
                return;
              case "repeat":
                if (
                  this.utilsService.isSameMinute(minuteDb, dateScheduler) &&
                  this.utilsService.isDiffDay(dateScheduler, item.repeatTime) &&
                  this.utilsService.isTimeDay(dateScheduler)
                ) {
                  const repeatFetchChannel = await client.channels.fetch(
                    item.channelId
                  );
                  if (roomVoice.length !== 0) {
                    repeatFetchChannel
                      .send(`@here our meeting room is <#${roomVoice[0]}>`)
                      .catch(console.error);
                    const repeatShift = roomVoice.shift(roomVoice[0]);
                    const channelNameRepeat = await client.channels.fetch(
                      repeatShift
                    );
                    let originalNameRepeat = channelNameRepeat.name;
                    const searchTermRepeat = "(";
                    const indexOfFirstRepeat =
                      originalNameRepeat.indexOf(searchTermRepeat);
                    if (indexOfFirstRepeat > 0) {
                      originalNameRepeat = originalNameRepeat.slice(
                        0,
                        indexOfFirstRepeat - 1
                      );
                      await channelNameRepeat.setName(
                        `${originalNameRepeat} (${item.task})`
                      );
                    } else
                      await channelNameRepeat.setName(
                        `${channelNameRepeat.name} (${item.task})`
                      );
                    const newRoomRepeat = channelNameRepeat.name;
                    await this.voiceChannelRepository
                      .insert({
                        voiceChannelId: channelNameRepeat.id,
                        originalName: originalNameRepeat,
                        newRoomName: newRoomRepeat,
                        createdTimestamp: Date.now(),
                      })
                      .catch((err) => console.log(err));
                  } else
                    await repeatFetchChannel
                      .send(`@here voice channel full`)
                      .catch(console.error);
                  let newCreatedTimestampRepeat = item.createdTimestamp;
                  newCreatedTimestampRepeat = currentDate.setDate(
                    currentDate.getDate() + item.repeatTime
                  );

                  while (
                    await this.utilsService.checkHolidayMeeting(currentDate)
                  ) {
                    newCreatedTimestampRepeat = currentDate.setDate(
                      currentDate.getDate() + item.repeatTime
                    );
                  }
                  await this.meetingRepository
                    .createQueryBuilder()
                    .update(Meeting)
                    .set({
                      reminder: true,
                      createdTimestamp: newCreatedTimestampRepeat,
                    })
                    .where('"id" = :id', { id: item.id })
                    .execute()
                    .catch(console.error);
                }
                return;
              default:
                break;
            }
          }
        });
      }
    });
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
