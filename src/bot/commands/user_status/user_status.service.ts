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

  // async getUserStatus(email) {
  //   return await this.userRepository
  //     .createQueryBuilder("user")
  //     .where(`"user.email" = :email`, { email: email })
  //     .orWhere(`"user.username" = :email`, { username: email })
  //     .select(`user.*`)
  //     .execute();
  // }
  async getUserStatus(email) {
    return await this.userRepository.findOne({
      where: [{ email: email }, { username: email }],
    });
  }
}
