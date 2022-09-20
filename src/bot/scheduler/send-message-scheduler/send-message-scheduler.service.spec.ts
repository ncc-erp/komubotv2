import { Test, TestingModule } from '@nestjs/testing';
import { describe } from 'node:test';
import { SendMessageSchedulerService } from './send-message-scheduler.service';

describe('SendMessageSchedulerService', () => {
  let service: SendMessageSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendMessageSchedulerService],
    }).compile();

    service = module.get<SendMessageSchedulerService>(SendMessageSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
