import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { Penalty } from "src/bot/models/penatly.entity";
import { User } from "src/bot/models/user.entity";
import { Brackets, Repository } from "typeorm";

@Injectable()
export class PenaltyService {
  constructor(
    @InjectRepository(Penalty)
    private penaltyRepository: Repository<Penalty>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  async findDataPenWithUserId(_userId, _channelId) {
    return await this.penaltyRepository
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId: _userId })
      .andWhere(`"channelId" = :channelId`, {
        channelId: _channelId,
      })
      .select("*")
      .execute();
  }
  async findDataPenWithUsername(_username, _channelId) {
    return await this.penaltyRepository
      .createQueryBuilder()
      .where(`"username" = :username`, { username: _username })
      .andWhere(`"channelId" = :channelId`, {
        channelId: _channelId,
      })
      .select("*")
      .execute();
  }
  async clearPenatly(_channelId) {
    return await this.penaltyRepository
      .createQueryBuilder()
      .update(Penalty)
      .set({ delete: true })
      .where(`"delete" = :delete`, { delete: false })
      .andWhere(`"channelId" = :channelId`, {
        channelId: _channelId,
      })
      .execute();
  }
  async findUser(param: string, prop: string) {
    return await this.userRepository
      .createQueryBuilder()
      .where(
        new Brackets((qb) => {
          if (prop === "userId")
            qb.where(`"userId" = :userId`, { userId: param });
          else qb.where(`"username" = :username`, { username: param });
        })
      )
      .andWhere(`"deactive" IS NOT true`)
      .select("*")
      .execute();
  }
  async findUserWithId(_userId) {
    return await this.userRepository
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId: _userId })
      .andWhere(`"deactive" IS NOT true`)
      .select("*")
      .execute();
  }
  async findUserWithUsername(_username) {
    return await this.userRepository
      .createQueryBuilder()
      .where(`"username" =:username`, { username: _username })
      .andWhere(`"deactive" IS NOT true`)
      .select("*")
      .execute();
  }
  async addNewPenatly(
    _userId,
    _username,
    _ammount,
    _reason,
    _createdTimestamp,
    _isReject,
    _channelId,
    _delete
  ) {
    const insertData = await this.penaltyRepository.save({
      userId: _userId,
      username: _username,
      ammount: _ammount,
      reason: _reason,
      createdTimestamp: _createdTimestamp,
      isReject: _isReject,
      channelId: _channelId,
      delete: _delete,
    });
    return await this.penaltyRepository
      .createQueryBuilder()
      .where(`"userId" =:userId`, { userId: _userId })
      .andWhere(`"id" =:id`, { id: insertData.id })
      .select("*")
      .execute();
  }
  async updateIsReject(id) {
    return await this.penaltyRepository
      .createQueryBuilder()
      .update(Penalty)
      .set({ isReject: true })
      .where(`"id" =:id`, { id: id })
      .execute();
  }
  async findPenatly(_channelId) {
    return await this.penaltyRepository
      .createQueryBuilder()
      .where(`"channelId" =:channelId`, {
        channelId: _channelId,
      })
      .andWhere(`"isReject" IS NOT true`)
      .andWhere(`"delete" IS NOT true`)
      .groupBy("Penalty.userId")
      .addGroupBy("Penalty.id")
      .select("SUM(ammount)", "ammount")
      .addSelect("Penalty.username")
      .addSelect("Penalty.userId")
      .orderBy({
        ammount: "DESC",
      })
      .select("*")
      .execute();
  }
}
