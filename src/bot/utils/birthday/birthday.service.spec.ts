import { Test, TestingModule } from '@nestjs/testing';
import { BirthdayService } from './birthdayservice';

describe('BirthdayService', () => {
  let service: BirthdayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BirthdayService],
    }).compile();

    service = module.get<BirthdayService>(BirthdayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
