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
      .createQueryBuilder()
      .update(Order)
      .set({ isCancel: true })
      .where("id = :id", { id: item.id })
      .execute();
  }
}
