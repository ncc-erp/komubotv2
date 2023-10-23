import { Logger } from "@nestjs/common";
import { CronJob } from "cron";
import { SchedulerRegistry, CronExpression } from "@nestjs/schedule";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ImportantSMS } from "src/bot/models/importantSMS.entity";

export class ImportantSchedulerService {
    constructor(
        @InjectDiscordClient()
        private client: Client,
        private schedulerRegistry: SchedulerRegistry,
        @InjectRepository(ImportantSMS)
        private readonly importantSMS: Repository<ImportantSMS>
    ) { }
    private readonly logger = new Logger(ImportantSchedulerService.name);
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

        setTimeout(() => {
            this.removeCronJob(name);
            job.start();
        }, 10 * 60 * 1000)
    }
    removeCronJob(name: string) {
        const job = this.schedulerRegistry.getCronJob(name);
        if (job) {
            job.stop();
        }
    }
    // Start cron job
    startCronJobs(): void {
        this.addCronJob("tagImportant", "*/2 * * * *", () =>
            this.tagImportant(this.client)
        );
    }

    async tagImportant(client: Client) {
        const repeatSMS = await this.getValidSMS();
        await this.checkAndSendNotifications(repeatSMS, client);
    }

    async getValidSMS() {
        return await this.importantSMS.createQueryBuilder('sms')
            .where(`sms.reminder < :count`, { count: 5 })
            .select("sms.*")
            .execute()
    }

    async checkAndSendNotifications(repeatSMS, client: Client) {
        repeatSMS.map(async (sms) => {
            sms.reminder += 1;
            await this.importantSMS.save(repeatSMS)
            const channel = await client.channels.fetch(sms.channelId);
            const sms1 = await (channel as TextChannel).messages.fetch(sms.message)
            await Promise.all(
                sms.users.map(async (user) => {
                    const notiUser = await client.users.fetch(user)
                    await notiUser.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('IMPORTANT MESSAGE')
                                .setDescription("```" + `${sms.id}:${sms1}` + "```")
                                .setColor("Random")
                        ]
                    })
                })
            )
        })
    }
}