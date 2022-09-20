import { TestingModule } from "@nestjs/testing";
import { describe, it } from "node:test";
import { MeetingSchedulerService } from "./meeting-scheduler.service";

describe('SchedulerService', () => {
  let service: MeetingSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingSchedulerService],
    }).compile();

    service = module.get<MeetingSchedulerService>(MeetingSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
