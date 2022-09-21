import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserStatusService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getUserStatus(email) {
    return await this.userRepository
      .createQueryBuilder(TABLE.USER)
      .where(`${TABLE.USER}.email = :email`, { email: email })
      .orWhere(`${TABLE.USER}.username = :username`, { username: email })
      .execute();
  }
}
