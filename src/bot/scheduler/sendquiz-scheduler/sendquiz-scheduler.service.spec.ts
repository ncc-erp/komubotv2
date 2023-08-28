import { Test, TestingModule } from '@nestjs/testing';
import { SendquizSchedulerService } from './sendquiz-scheduler.service';

describe('SendquizSchedulerService', () => {
  let service: SendquizSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendquizSchedulerService],
    }).compile();

    service = module.get<SendquizSchedulerService>(SendquizSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
