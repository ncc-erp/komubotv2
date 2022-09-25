import { Test, TestingModule } from '@nestjs/testing';
import { UpdateRoleSchedulerService } from './updateRole-scheduler.service';

describe('UpdateRoleSchedulerService', () => {
  let service: UpdateRoleSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateRoleSchedulerService],
    }).compile();

    service = module.get<UpdateRoleSchedulerService>(UpdateRoleSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
