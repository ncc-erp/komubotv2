import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { MeetingSchedulerService } from "./bot/scheduler/meetingScheduler/meetingScheduler.service";
import { ReminderSchedulerService } from "./bot/scheduler/reminderScheduler/reminder.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.listen(5001);

  const meetingSchedulerServiceService = app.get(MeetingSchedulerService);
  const reminderSchedulerServiceService = app.get(ReminderSchedulerService);
  await meetingSchedulerServiceService.startCronJobs();
  await reminderSchedulerServiceService.startCronJobs();
}

bootstrap();
