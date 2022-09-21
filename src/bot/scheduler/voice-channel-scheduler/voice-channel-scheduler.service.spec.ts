import { Test, TestingModule } from '@nestjs/testing';
import { VoiceChannelSchedulerService } from './voice-channel-scheduler.service';

describe('VoiceChannelSchedulerService', () => {
  let service: VoiceChannelSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoiceChannelSchedulerService],
    }).compile();

    service = module.get<VoiceChannelSchedulerService>(VoiceChannelSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
