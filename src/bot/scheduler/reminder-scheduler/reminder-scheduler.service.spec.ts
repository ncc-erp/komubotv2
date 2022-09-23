import { Test, TestingModule } from '@nestjs/testing';
import { ReminderSchedulerService } from './reminder-scheduler.service';

describe('ReminderSchedulerService', () => {
  let service: ReminderSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderSchedulerService],
    }).compile();

    service = module.get<ReminderSchedulerService>(ReminderSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
