import { TestingModule } from "@nestjs/testing";
import { describe, it } from "node:test";
import { WfhSchedulerService } from "./wfh-scheduler.service";

describe('SchedulerService', () => {
  let service: WfhSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WfhSchedulerService],
    }).compile();

    service = module.get<WfhSchedulerService>(WfhSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
