import { Injectable } from "@nestjs/common";
import { EmbedBuilder } from "discord.js";
import { TABLE } from "../constants/table";
import { UntilService } from "../utils/until.service";


@Injectable()
export class OrderService {
  constructor(private untilService: UntilService) {}
  async orderCommand(message, args, orderData, Order) {
    try {
      let channelId = message.channelId;
      let author = message.author.id;
      let username = message.author.username;

      if (args[0] === "cancel") {
        const userCancel = await orderData
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
        const userCancel = await orderData
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
          const listOrder = await orderData
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
            .andWhere(
              `${
                TABLE.ORDER
              }.createdTimestamp > ${this.untilService.getYesterdayDate()}`
            )
            .andWhere(
              `${
                TABLE.ORDER
              }.createdTimestamp < ${this.untilService.getTomorrowDate()}`
            )
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
