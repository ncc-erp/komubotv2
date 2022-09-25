import { Test, TestingModule } from '@nestjs/testing';
import { reportTrackerService } from './reportTracker.service';

describe('reportTrackerService', () => {
  let service: reportTrackerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [reportTrackerService],
    }).compile();

    service = module.get<reportTrackerService>(reportTrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
