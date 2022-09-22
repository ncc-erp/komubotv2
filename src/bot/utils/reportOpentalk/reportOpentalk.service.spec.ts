import { Test, TestingModule } from '@nestjs/testing';
import { ReportOpenTalkService } from './reportOpentalk.service';

describe('ReportOpenTalkService', () => {
  let service: ReportOpenTalkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportOpenTalkService],
    }).compile();

    service = module.get<ReportOpenTalkService>(ReportOpenTalkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
