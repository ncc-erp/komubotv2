import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class WomanDayService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  async findWomanUser(userWomenTest) {
    return await this.userRepository
      .createQueryBuilder()
      .where(`"email" IN (:emails)`, { emails: userWomenTest })
      .andWhere(`"deactive" IS NOT TRUE `)
      .execute();
  }
}
