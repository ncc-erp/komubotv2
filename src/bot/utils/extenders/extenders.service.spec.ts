import { Test, TestingModule } from '@nestjs/testing';
import { ExtendersService } from './extenders.service';

describe('ExtendersService', () => {
  let service: ExtendersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtendersService],
    }).compile();

    service = module.get<ExtendersService>(ExtendersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
