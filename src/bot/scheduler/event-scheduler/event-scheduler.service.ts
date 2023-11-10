import { Logger } from "@nestjs/common";
import { CronJob } from "cron";
import { SchedulerRegistry, CronExpression } from "@nestjs/schedule";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { ChannelType, Client } from "discord.js";
import { UtilsService } from "src/bot/utils/utils.service";
import { InjectRepository } from "@nestjs/typeorm";
import { VoiceChannels } from "src/bot/models/voiceChannel.entity";
import { Repository } from "typeorm";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { EventEntity } from "src/bot/models/event.entity";

export class EventSchedulerService {
    constructor(
        @InjectRepository(EventEntity)
        private readonly eventRepository: Repository<EventEntity>,
        private utilsService: UtilsService,
        @InjectRepository(VoiceChannels)
        private voiceChannelRepository: Repository<VoiceChannels>,
        private schedulerRegistry: SchedulerRegistry,
        private configClient: ClientConfigService,
        @InjectDiscordClient()
        private client: Client
    ) { }

    private readonly logger = new Logger(EventSchedulerService.name);
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
        this.addCronJob("tagEvent", CronExpression.EVERY_MINUTE, () =>
            this.tagEvent(this.client)
        );
        this.addCronJob("updateReminderEvent", CronExpression.EVERY_MINUTE, () =>
            this.updateReminderEvent()
        );
    }

    async tagEvent(client: Client) {
        const getAllVoice = await this.getAllVoiceChannels(client);
        const repeatEvent = await this.getValidEvent();

        const voiceNow = await this.getActiveVoiceChannels();

        const { countVoice, roomVoice } = await this.getCountAndRooms(
            getAllVoice,
            voiceNow,
            client
        );

        await this.checkAndSendNotifications(
            client,
            repeatEvent,
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

    async getValidEvent() {
        return await this.eventRepository
            .createQueryBuilder("event")
            .where(`"reminder" IS NOT TRUE`)
            .andWhere(`"cancel" IS NOT TRUE`)
            .select("event.*")
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
        repeatEvent,
        countVoice,
        getAllVoice,
        roomVoice
    ) {
        for (const data of repeatEvent) {
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
                const mess = `Event: voice channel full`
                await this.sendMessage(mess, data.id, client)
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
        await this.handleOnceMeeting(
            data,
            roomVoice,
            dateCreatedTimestamp,
            client,
            dateScheduler,
            minuteDb
        );
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
            await this.handleRenameVoiceChannel(
                roomVoice,
                client,
                data
            );
            await this.eventRepository
                .createQueryBuilder()
                .update(EventEntity)
                .set({ reminder: true })
                .where('"id" = :id', { id: data.id })
                .execute()
                .catch(console.error);
        }
    }

    async handleRenameVoiceChannel(roomVoice, client, data) {
        if (roomVoice.length !== 0) {
            const mess = `Please join the event ${data.title} at <#${roomVoice[0]}> ${data.attachment}`
            await this.sendMessage(mess, data.id, client)
            const voiceRemove = roomVoice.shift(roomVoice[0]);
            const voiceChannel = await client.channels.fetch(voiceRemove);
            let originalName = voiceChannel.name;
            const searchTerm = "(";
            const indexOfFirst = originalName.indexOf(searchTerm);
            if (indexOfFirst > 0) {
                originalName = originalName.slice(0, indexOfFirst - 1);
                await voiceChannel.setName(`${originalName} (${data.title})`);
            } else {
                await voiceChannel.setName(`${voiceChannel.name} (${data.title})`);
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
            const mess = `Event: voice channel full`
            await this.sendMessage(mess, data.id, client)
        }
    }

    async sendMessage(message, id: number, client: Client) {
        const event = await this.eventRepository.findOne({ where: { id } })
        event.users.map(async (item) => {
            const user = await client.users.fetch(item);
            await user.send(`${message}`)
        })
    }

    async updateReminderEvent() {
        if (await this.utilsService.checkHoliday()) return;
        const repeatEvent = await this.eventRepository.find({
            where: {
                reminder: true,
            },
        });
        const dateTimeNow = new Date();
        dateTimeNow.setHours(dateTimeNow.getHours());
        const hourDateNow = dateTimeNow.getHours();
        const minuteDateNow = dateTimeNow.getMinutes();
        repeatEvent.map(async (item) => {
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
                await this.eventRepository.update(
                    { id: item.id },
                    { cancel: true }
                );
            }
        });
    }
}