import { Test, TestingModule } from '@nestjs/testing';
import { ReportHolidayService } from './reportHoliday.service';

describe('ReportHolidayService', () => {
  let service: ReportHolidayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportHolidayService],
    }).compile();

    service = module.get<ReportHolidayService>(ReportHolidayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
