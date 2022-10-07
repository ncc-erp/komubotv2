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
      .createQueryBuilder(TABLE.PENATLY)
      .where(`${TABLE.PENATLY}."userId" = :userId`, { userId: _userId })
      .andWhere(`${TABLE.PENATLY}.channelId = :channelId`, {
        channelId: _channelId,
      })
      .execute();
  }
  async findDataPenWithUsername(_username, _channelId) {
    return await this.penaltyRepository
      .createQueryBuilder(TABLE.PENATLY)
      .where(`${TABLE.PENATLY}.username = :username`, { username: _username })
      .andWhere(`${TABLE.PENATLY}.channelId = :channelId`, {
        channelId: _channelId,
      })
      .execute();
  }
  async clearPenatly(_channelId) {
   

    return await this.penaltyRepository
      .createQueryBuilder()
      .update(Penalty)
      .set({ delete: true })
      .where(`${TABLE.PENATLY}.delete = :delete`, { delete: false })
      .andWhere(`${TABLE.PENATLY}."channelId" = :channelId`, {
        channelId: _channelId,
      })
      .execute();
  }
  async findUser(param: string, prop: string) {
    return await this.userRepository
      .createQueryBuilder(TABLE.USER)
      .where(
        new Brackets((qb) => {
          if (prop === "userId")
            qb.where(`${TABLE.USER}.userId = :userId`, { userId: param });
          else
            qb.where(`${TABLE.USER}.username = :username`, { username: param });
        })
      )
      .andWhere(`${TABLE.USER}.deactive =:deactive`, { deactive: false })
      .execute();
  }
  async findUserWithId(_userId) {
   
    return await this.userRepository
      .createQueryBuilder(TABLE.USER)
      .where(`${TABLE.USER}."userId" = :userId`, { userId: _userId })
      .andWhere(`${TABLE.USER}.deactive =:deactive`, { deactive: false })
      .execute();
  }
  async findUserWithUsername(_username) {
    return await this.userRepository
      .createQueryBuilder(TABLE.USER)
      .where(`${TABLE.USER}.username =:username`, { username: _username })
      .andWhere(`${TABLE.USER}.deactive =:deactive`, { deactive: false })
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
      .createQueryBuilder(TABLE.PENATLY)
      .where(`${TABLE.PENATLY}.channelId =:channelId`, {
        channelId: _channelId,
      })
      .andWhere(`${TABLE.PENATLY}.isReject =:isReject`, { isReject: false })
      .andWhere(`${TABLE.PENATLY}.delete =:delete`, { delete: false })
      .groupBy(`${TABLE.PENATLY}.userId`)
      .addGroupBy(`${TABLE.PENATLY}.username`)
      .select(`SUM(${TABLE.PENATLY}.ammount)`, "ammount")
      .addSelect(`${TABLE.PENATLY}.username`)
      .addSelect(`${TABLE.PENATLY}."userId"`)
      .orderBy({
        ammount: "DESC",
      })
      .execute();
  }
}
