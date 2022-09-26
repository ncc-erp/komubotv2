import { Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { UtilsService } from "src/bot/utils/utils.service";
import { CronJob } from "cron";
import { UpdateRole } from "src/bot/utils/roles.utils";
import { Client } from "discord.js";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class UpdateRoleSchedulerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private updateRole: UpdateRole,
    @InjectDiscordClient()
    private client: Client,
    ) {}

  private readonly logger = new Logger(UpdateRoleSchedulerService.name);

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
    this.addCronJob("updateRoleProject", CronExpression.EVERY_MINUTE, () =>
      this.updateRole.updateRoleProject(this.client)
    );
    this.addCronJob("updateRoleDiscord", CronExpression.EVERY_MINUTE, () =>
      this.updateRole.updateRoleDiscord(this.client)
    );
  }
}
