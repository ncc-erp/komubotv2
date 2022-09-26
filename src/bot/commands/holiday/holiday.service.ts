import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Holiday } from "src/bot/models/holiday.entity";
import { Repository } from "typeorm";

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private leaveReposistory: Repository<Holiday>
  ) {}

  async addHoliday(dateTime, messageHoliday) {
    await this.leaveReposistory.insert({
      dateTime: dateTime,
      content: messageHoliday,
    });
  }
}
