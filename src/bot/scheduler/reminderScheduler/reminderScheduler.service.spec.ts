import { Test, TestingModule } from '@nestjs/testing';
import { PingReminderService } from './reminder.service';

describe('PingReminderService', () => {
  let service: PingReminderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PingReminderService],
    }).compile();

    service = module.get<PingReminderService>(PingReminderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
