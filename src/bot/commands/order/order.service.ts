import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../../models/order.entity";
import { User } from "src/bot/models/user.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  async getUserCancelOrder(channelId, author, username) {
    return await this.orderRepository
      .createQueryBuilder("orders")
      .where(`"channelId" = :channelId`, {
        channelId: channelId,
      })
      .andWhere(`"isCancel" IS NOT True`, { isCancel: false })
      .andWhere(`"userId" = :userId`, {
        userId: author,
      })
      .andWhere(`"username" = :username`, {
        username: username,
      })
      .select("orders.*")
      .execute();
  }

  async upDateUserCancel(item) {
    return await this.orderRepository
      .createQueryBuilder("orders")
      .update(Order)
      .set({ isCancel: true })
      .where("id = :id", { id: item.id })
      .execute();
  }

  async getListUserOrderPending(channelId, author, username) {
    return await this.orderRepository
      .createQueryBuilder("orders")
      .where(`"channelId" = :channelId`, {
        channelId: channelId,
      })
      .andWhere(`"isCancel" IS NOT TRUE`)
      .andWhere(`"userId" = :userId`, { userId: author })
      .andWhere(`"username" = :username`, {
        username: username,
      })
      .select("orders.*")
      .execute();
  }

  async getListUserFinish(channelId, yesterdayDate, tomorrowDate) {
    const arrayUser = await this.orderRepository
      .createQueryBuilder("orders")
      .select("username")
      .addSelect('MAX("createdTimestamp")', "timeStamp")
      .where(`"channelId" = :channelId`, {
        channelId: channelId,
      })
      .andWhere(`"isCancel" IS NOT TRUE`)
      .andWhere(`"createdTimestamp" > ${yesterdayDate}`)
      .andWhere(`"createdTimestamp" < ${tomorrowDate}`)
      .groupBy("username")
      .execute();

    return await this.orderRepository
      .createQueryBuilder("orders")
      .where('"createdTimestamp" IN (:...time_stamps)', {
        time_stamps: arrayUser.map((item) => item.timeStamp),
      })
      .select("orders.*")
      .execute();

    // return await this.orderRepository
    // .createQueryBuilder("orders")
    // .distinctOn(['username'])
    // .orderBy('"username"', 'DESC')
    // .where(`"channelId" = :channelId`, {
    //   channelId: channelId,
    // })
    // .andWhere(`"isCancel" IS NOT TRUE`)
    // .andWhere(`"createdTimestamp" > ${yesterdayDate}`)
    // .andWhere(`"createdTimestamp" < ${tomorrowDate}`)
    // .select("orders.*")
    // .execute();
  }

  async updateFinishOrder(channelId) {
    return await this.orderRepository
      .createQueryBuilder("orders")
      .where(`"channelId" = :channelId`, {
        channelId: channelId,
      })
      .andWhere(`"isCancel" IS NOT True`, {
        isCancel: false,
      })
      .select("orders.*")
      .execute();
  }

  async order(channelId, author, username, list) {
    return await this.orderRepository.insert({
      channelId: channelId,
      userId: author,
      username: username,
      menu: list,
      createdTimestamp: Date.now(),
      isCancel: false,
    });
  }

  async getDataUser(author: String) {
    return await this.userRepository
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId: author })
      .andWhere(`"deactive" IS NOT true`)
      .select("*")
      .getRawOne();
  }
}
