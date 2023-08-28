import { Test, TestingModule } from '@nestjs/testing';
import { ReportMsgCountService } from './reportMsgCount.service';

describe('ReportMsgCountService', () => {
  let service: ReportMsgCountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportMsgCountService],
    }).compile();

    service = module.get<ReportMsgCountService>(ReportMsgCountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
