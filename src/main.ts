import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { DatingSchedulerService } from "./bot/scheduler/dating-scheduler/dating-scheduler.service";
import { MeetingSchedulerService } from "./bot/scheduler/meeting-scheduler/meeting-scheduler.service";
import { ReminderSchedulerService } from "./bot/scheduler/reminder-scheduler/reminder-scheduler.service";
import { SendMessageSchedulerService } from "./bot/scheduler/send-message-scheduler/send-message-scheduler.service";
import { UpdateRoleSchedulerService } from "./bot/scheduler/updateRole-scheduler/updateRole-scheduler.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.listen(5001);

  // const meetingSchedulerService = app.get(MeetingSchedulerService);
  // await meetingSchedulerService.startCronJobs();
  // const reminderSchedulerService = app.get(ReminderSchedulerService);
  // await reminderSchedulerService.startCronJobs();
  // const sendMessageSchedulerService = app.get(SendMessageSchedulerService);
  // await sendMessageSchedulerService.startCronJobs();
  // const datingSchedulerService = app.get(DatingSchedulerService);
  // await datingSchedulerService.startCronJobs();
  //  const updateRoleSchedulerService = app.get(UpdateRoleSchedulerService);
  // await updateRoleSchedulerService.startCronJobs();
}

bootstrap();
