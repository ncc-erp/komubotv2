import { Test, TestingModule } from '@nestjs/testing';
import { ReportCheckoutService } from './reportCheckout.service';

describe('ReportCheckoutService', () => {
  let service: ReportCheckoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportCheckoutService],
    }).compile();

    service = module.get<ReportCheckoutService>(ReportCheckoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
