import { Test, TestingModule } from '@nestjs/testing';
import { ReportWomenDayService } from './reportWomenDay.service';

describe('ReportWomenDayService', () => {
  let service: ReportWomenDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportWomenDayService],
    }).compile();

    service = module.get<ReportWomenDayService>(ReportWomenDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
