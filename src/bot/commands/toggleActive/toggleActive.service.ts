import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ToggleActiveService {
  constructor(
    @InjectRepository(User)
    private userData: Repository<User>
  ) {}

  async findAcc(userId, authorId) {
    return await this.userData.findOne({
      where: [{ userId: userId }, { username: authorId }],
    });
  }

  async deactiveAcc(id) {
    return await this.userData.update(id, { deactive: true });
  }
  async ActiveAcc(id) {
    return await this.userData.update(id, { deactive: false });
  }
}
