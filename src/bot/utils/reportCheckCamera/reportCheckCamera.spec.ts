import { Test, TestingModule } from '@nestjs/testing';
import { ReportCheckCameraService } from './reportCheckCamera.service';

describe('ReportCheckCameraService', () => {
  let service: ReportCheckCameraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportCheckCameraService],
    }).compile();

    service = module.get<ReportCheckCameraService>(ReportCheckCameraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
