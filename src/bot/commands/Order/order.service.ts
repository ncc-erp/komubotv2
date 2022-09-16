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
  ) {}
  async getUserCancelOrder(channelId, author, username) {
    return await this.orderReposistory
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
      .execute();
  }
  async upDateUserCancel(item) {
    return await this.orderReposistory
      .createQueryBuilder("orders")
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
      .execute();
  }
  async getListUserFinish(channelId, yesterdayDate, tomorrowDate) {
    return await this.orderReposistory
      .createQueryBuilder("orders")
      .distinctOn(["username"])
      .orderBy("username")
      .where(`"channelId" = :channelId`, {
        channelId: channelId,
      })
      .andWhere(`"isCancel" IS NOT TRUE`)
      .andWhere(`"createdTimestamp" > ${yesterdayDate}`)
      .andWhere(`"createdTimestamp" < ${tomorrowDate}`)
      .select("orders.*")
      .execute();
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
      .execute();
  }
  async order(channelId,author,username,list,){
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
