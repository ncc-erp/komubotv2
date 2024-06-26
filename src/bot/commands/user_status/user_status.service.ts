import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
      .createQueryBuilder()
      .where(`"email" = :email`, { email: email })
      .orWhere(`"username" = :username`, { username: email })
      .select("*")
      .execute();
  }
  async getUserStatusID(Id) {
    return await this.userRepository
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId: Id })
      .orWhere(`"email" = :email`, { email: Id })
      .select("*")
      .execute();
  }
}
