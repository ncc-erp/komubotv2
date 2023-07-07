import { InjectDiscordClient } from "@discord-nestjs/core";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, EmbedBuilder, Message } from "discord.js";
import { Order } from "src/bot/models/order.entity";
import { Repository } from "typeorm";
import { UtilsService } from "../utils.service";

@Injectable()
export class ReportOrderService {
  constructor(
    private utilsService: UtilsService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  async reportOrder(message: Message) {
    try {
      const channel = message.channelId;

      const arrayUser = await this.orderRepository
        .createQueryBuilder("orders")
        .select("email")
        .addSelect('MAX("createdTimestamp")', "timeStamp")
        .where(`"channelId" = :channelId`, {
          channelId: channel,
        })
        .andWhere(`"isCancel" IS NOT TRUE`)
        .andWhere(
          `"createdTimestamp" > ${this.utilsService.getYesterdayDate()}`
        )
        .andWhere(`"createdTimestamp" < ${this.utilsService.getTomorrowDate()}`)
        .groupBy("email")
        .execute();

      if (arrayUser.length > 0) {
        const listOrder = await this.orderRepository
          .createQueryBuilder("orders")
          .where('"createdTimestamp" IN (:...time_stamps)', {
            time_stamps: arrayUser.map((item) => item.timeStamp),
          })
          .select("orders.*")
          .execute();

        let mess: any;
        if (!listOrder) {
          return;
        } else if (Array.isArray(listOrder) && listOrder.length === 0) {
          mess = "```" + "Không có ai order" + "```";
          return message.reply(mess).catch(console.error);
        } else {
          for (let i = 0; i <= Math.ceil(listOrder.length / 50); i += 1) {
            if (listOrder.slice(i * 50, (i + 1) * 50).length === 0) break;
            mess = listOrder
              .slice(i * 50, (i + 1) * 50)
              .map(
                (list) => `<${list.email}> order ${list.menu.toUpperCase()}`
              )
              .join("\n");
            const Embed = new EmbedBuilder()
              .setTitle(
                `Danh sách order ngày hôm nay tổng là ${listOrder.length} người`
              )
              .setColor("Red")
              .setDescription(`${mess}`);
            await message.reply({ embeds: [Embed] }).catch(console.error);
          }
        }
      } else {
        return message.reply({
          content: "Không có ai order",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
