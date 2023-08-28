import { Test, TestingModule } from '@nestjs/testing';
import { MentionSchedulerService } from './mention-scheduler.service';

describe('MentionSchedulerService', () => {
  let service: MentionSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MentionSchedulerService],
    }).compile();

    service = module.get<MentionSchedulerService>(MentionSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
