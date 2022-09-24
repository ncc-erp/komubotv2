import { TestingModule } from "@nestjs/testing";
import { describe, it } from "node:test";
import { DatingSchedulerService } from "./dating-scheduler.service";

describe('SchedulerService', () => {
  let service: DatingSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatingSchedulerService],
    }).compile();

    service = module.get<DatingSchedulerService>(DatingSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
