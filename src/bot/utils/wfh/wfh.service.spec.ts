import { Test, TestingModule } from '@nestjs/testing';
import { WfhService } from './wfh.service';

describe('WfhService', () => {
  let service: WfhService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WfhService],
    }).compile();

    service = module.get<WfhService>(WfhService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
