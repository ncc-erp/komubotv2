import { InjectRepository } from "@nestjs/typeorm";
import { Message, Client, EmbedBuilder } from "discord.js";
import { DataSource, Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../base/command.base";
import { TABLE } from "../constants/table";
import { Order } from "../models/order.entity";
import { getTomorrowDate, getYesterdayDate } from "../utils/date.utils";

interface IOrder {
  komu_order_id: number;
  komu_order_userId: string;
  komu_order_channelId: string;
  komu_order_menu: string;
  komu_order_username: string;
  komu_order_isCancel: Boolean;
  komu_order_createdTimestamp: number;
}

@CommandLine({
  name: "order",
  description: "order",
})
export default class OrderCommand implements CommandLineClass {
  constructor(
    @InjectRepository(Order)
    private orderReposistory: Repository<Order>
  ) {}

  async execute(message: Message, args, _, __, ___, dataSource: DataSource) {
    const orderData = this.orderReposistory;
    try {
      let channelId = message.channelId;
      let author = message.author.id;
      let username = message.author.username;
      if (args[0] === "cancel") {
        const userCancel: IOrder[] = await orderData
          .createQueryBuilder(TABLE.ORDER)
          .where(`${TABLE.ORDER}.channelId = :channelId`, {
            channelId: channelId,
          })
          .andWhere(`${TABLE.ORDER}.isCancel IS NOT True`, { isCancel: false })
          .andWhere(`${TABLE.ORDER}.userId = :userId`, {
            userId: author,
          })
          .andWhere(`${TABLE.ORDER}.username= :username`, {
            username: username,
          })
          .execute();
        console.log(userCancel);
        userCancel.map(async (item) => {
          await orderData
            .createQueryBuilder(TABLE.ORDER)
            .update(Order)
            .set({ isCancel: true })
            .where(`id = :id`, { id: item.komu_order_id })
            .execute();
        });
        message.reply({
          content: "Bạn đã hủy đơn đặt hàng!!!",
        });
      } else if (args[0] === "finish") {
        const userCancel: IOrder[] = await orderData
          .createQueryBuilder(TABLE.ORDER)
          .where(`${TABLE.ORDER}.channelId = :channelId`, {
            channelId: channelId,
          })
          .andWhere(`${TABLE.ORDER}.isCancel IS NOT TRUE`, { isCancel: false })
          .andWhere(`${TABLE.ORDER}.userId = :userId`, { userId: author })
          .andWhere(`${TABLE.ORDER}.username= :username`, {
            username: username,
          })
          .execute();
        if (userCancel && userCancel.length > 0) {
          const listOrder: IOrder[] = await orderData
            .createQueryBuilder(TABLE.ORDER)
            .distinctOn([`${TABLE.ORDER}.username`])
            .orderBy(`${TABLE.ORDER}.username`)
            .where(`${TABLE.ORDER}.channelId = :channelId`, {
              channelId: channelId,
            })
            .andWhere(`${TABLE.ORDER}.isCancel IS NOT TRUE`, {
              isCancel: false,
            })
            .andWhere(`${TABLE.ORDER}.isCancel IS NOT TRUE`, {
              isCancel: false,
            })
            .andWhere(`${TABLE.ORDER}.createdTimestamp > ${getYesterdayDate()}`)
            .andWhere(`${TABLE.ORDER}.createdTimestamp < ${getTomorrowDate()}`)
            .execute();
          let mess;
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
                  (list) =>
                    `<${
                      list.komu_order_username
                    }> order ${list.komu_order_menu.toUpperCase()}`
                )
                .join("\n");
              const Embed = new EmbedBuilder()
                .setTitle(`Chốt đơn!!! Tổng là ${listOrder.length} người`)
                .setColor("Red")
                .setDescription(`${mess}`);
              await message.reply({ embeds: [Embed] }).catch(console.error);
            }
          }
          const reportOrder = await orderData
            .createQueryBuilder(TABLE.ORDER)
            .where(`${TABLE.ORDER}.channelId = :channelId`, {
              channelId: channelId,
            })
            .andWhere(`${TABLE.ORDER}.isCancel IS NOT True`, {
              isCancel: false,
            })
            .execute();
          reportOrder.map(async (item) => {
            await orderData
              .createQueryBuilder(TABLE.ORDER)
              .update(Order)
              .set({ isCancel: true })
              .where(`id = :id`, { id: item.komu_order_id })
              .execute();
          });
        } else {
          message.reply({
            content: "Bạn không thể chốt đơn!!!",
          });
        }
      } else {
        const list = args.slice(0, args.length).join(" ");
        await orderData
          .insert({
            channelId: channelId,
            userId: author,
            username: username,
            menu: list,
            createdTimestamp: Date.now(),
            isCancel: false,
          })
          .catch((err) => console.log(err));
        message.reply({
          content: "`✅` Bạn đã đặt đơn!!!",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
