import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmbedBuilder } from "discord.js";
import { Repository } from "typeorm";
import { TABLE } from "../../constants/table";
import { Order } from "../../models/order.entity";
import { UntilService } from "../../untils/until.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderReposistory: Repository<Order>
  ) { }
  async getUserCancelOrder(channelId, author, username) {
    return await this.orderReposistory
      .createQueryBuilder('orders')
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
    return await this.orderReposistory
      .createQueryBuilder('orders')
      .update(Order)
      .set({ isCancel: true })
      .where("id = :id", { id: item.id })
      .execute();
  }
  async getListUserOrderPending(channelId, author, username) {
    return await this.orderReposistory
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
    const arrayUser = await this.orderReposistory
      .createQueryBuilder("orders")
      .select("username")
      .addSelect('MAX("createdTimestamp")','timeStamp')
      .where(`"channelId" = :channelId`, {
        channelId: channelId,
      })
      .andWhere(`"isCancel" IS NOT TRUE`)
      .andWhere(`"createdTimestamp" > ${yesterdayDate}`)
      .andWhere(`"createdTimestamp" < ${tomorrowDate}`)
      .groupBy("username")
      .execute()
      
    return await this.orderReposistory.createQueryBuilder('orders')
    .where('"createdTimestamp" IN (:...time_stamps)', {
      time_stamps : arrayUser.map(item => item.timeStamp)
    })
    .select("orders.*")
    .execute();
    
      // return await this.orderReposistory
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
    return await this.orderReposistory
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
  async order(channelId, author, username, list,) {
    return await this.orderReposistory
      .insert({
        channelId: channelId,
        userId: author,
        username: username,
        menu: list,
        createdTimestamp: Date.now(),
        isCancel: false,
      })
  }
}
