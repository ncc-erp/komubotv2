import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Holiday } from "src/bot/models/holiday.entity";
import { Repository } from "typeorm";

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private leaveRepository: Repository<Holiday>
  ) {}

  async addHoliday(dateTime, messageHoliday) {
    await this.leaveRepository.insert({
      dateTime: dateTime,
      content: messageHoliday,
    });
  }
}
