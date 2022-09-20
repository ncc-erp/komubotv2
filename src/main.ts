import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { MeetingSchedulerService } from "./bot/scheduler/meeting-scheduler/meeting-scheduler.service";
import { ReminderSchedulerService } from "./bot/scheduler/reminder-scheduler/reminder-scheduler.service";
import { SendMessageSchedulerService } from "./bot/scheduler/send-message-scheduler/send-message-scheduler.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.listen(5001);

  const meetingSchedulerService = app.get(MeetingSchedulerService);
  const reminderSchedulerService = app.get(ReminderSchedulerService);
  const sendMessageSchedulerService = app.get(SendMessageSchedulerService);
  await meetingSchedulerService.startCronJobs();
  await sendMessageSchedulerService.startCronJobs();
  await reminderSchedulerService.startCronJobs();
}

bootstrap();
