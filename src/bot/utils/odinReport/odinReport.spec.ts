import { Test, TestingModule } from '@nestjs/testing';
import { OdinReportService } from './odinReport.service';

describe('OdinReportService', () => {
  let service: OdinReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OdinReportService],
    }).compile();

    service = module.get<OdinReportService>(OdinReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
