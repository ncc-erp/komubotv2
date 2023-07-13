import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { DatingSchedulerService } from "./bot/scheduler/dating-scheduler/dating-scheduler.service";
import { MeetingSchedulerService } from "./bot/scheduler/meeting-scheduler/meeting-scheduler.service";
import { MentionSchedulerService } from "./bot/scheduler/mention-scheduler/mention-scheduler.service";
import { ReminderSchedulerService } from "./bot/scheduler/reminder-scheduler/reminder-scheduler.service";
import { SendMessageSchedulerService } from "./bot/scheduler/send-message-scheduler/send-message-scheduler.service";
import { SendquizSchedulerService } from "./bot/scheduler/sendquiz-scheduler/sendquiz-scheduler.service";
import { UpdateRoleSchedulerService } from "./bot/scheduler/updateRole-scheduler/updateRole-scheduler.service";
import { VoiceChannelSchedulerService } from "./bot/scheduler/voice-channel-scheduler/voice-channel-scheduler.service";
import { WfhSchedulerService } from "./bot/scheduler/wfh-scheduler/wfh-scheduler.service";
import { setupSwagger } from "./setup-swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.listen(3000, () => {
    console.log("App listen on port 3000");
  });
  setupSwagger(app);

  // const meetingSchedulerService = app.get(MeetingSchedulerService);
  // await meetingSchedulerService.startCronJobs();
  // const reminderSchedulerService = app.get(ReminderSchedulerService);
  // await reminderSchedulerService.startCronJobs();
  // const sendMessageSchedulerService = app.get(SendMessageSchedulerService);
  // await sendMessageSchedulerService.startCronJobs();
  // const datingSchedulerService = app.get(DatingSchedulerService);
  // await datingSchedulerService.startCronJobs();
  // const updateRoleSchedulerService = app.get(UpdateRoleSchedulerService);
  // await updateRoleSchedulerService.startCronJobs();
  // const voiceChannelSchedulerService = app.get(VoiceChannelSchedulerService);
  // await voiceChannelSchedulerService.startCronJobs();
  // const sendquizSchedulerService = app.get(SendquizSchedulerService);
  // await sendquizSchedulerService.startCronJobs();
  // const mentionSchedulerService = app.get(MentionSchedulerService);
  // await mentionSchedulerService.startCronJobs();
  // const wfhSchedulerService = app.get(WfhSchedulerService);
  // await wfhSchedulerService.startCronJobs();
}

bootstrap();
