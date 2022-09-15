import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Message } from "discord.js";
import { DataSource, Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../../base/command.base";
import { TABLE } from "../../constants/table";
import { Order } from "../../models/order.entity";
import { UntilService } from "../../untils/until.service";
import { OrderService } from "./order.service";

@CommandLine({
  name: "order",
  description: "order",
})
export class OrderCommand implements CommandLineClass {
  constructor(private orderService: OrderService) {}

  async execute(message: Message, args) {
    const orderData = this.orderService;
    const channelId = message.channel.id;
    let authorId = message.author.id;
    let username = message.author.username;

    try {
      if (!args[0]) {
        return message.reply({
          content: "Order không được để trống!",
        });
      } else if (args[0] === "cancel") {
        const userCancel = await this.orderService.getUserCancelOrder(
          channelId,
          authorId,
          username
        );

        userCancel.map(async (item) => {
          await this.orderService.upDateUserCancel(item);
        });

        message.reply({
          content: "Bạn đã hủy đơn đặt hàng!!!",
        });
      } 
      // else if (args[0] === "finish") {
      //   const userCancel = await orderData
      //     .createQueryBuilder()
      //     .where(`"channelId" = :channelId`, {
      //       channelId: channelId,
      //     })
      //     .andWhere(`"isCancel" IS NOT TRUE`)
      //     .andWhere(`"userId" = :userId`, { userId: author })
      //     .andWhere(`"username" = :username`, {
      //       username: username,
      //     })
      //     .execute();
      //   if (userCancel && userCancel.length > 0) {
      //     const listOrder = await orderData
      //       .createQueryBuilder("orders")
      //       .distinctOn(["username"])
      //       .orderBy("username")
      //       .where(`"channelId" = :channelId`, {
      //         channelId: channelId,
      //       })
      //       .andWhere(`"isCancel" IS NOT TRUE`)
      //       .andWhere(
      //         `"createdTimestamp" > ${this.untilService.getYesterdayDate()}`
      //       )
      //       .andWhere(
      //         `"createdTimestamp" < ${this.untilService.getTomorrowDate()}`
      //       )
      //       .select("orders.*")
      //       .execute();
      //     let mess;
      //     if (!listOrder) {
      //       return;
      //     } else if (Array.isArray(listOrder) && listOrder.length === 0) {
      //       mess = "```" + "Không có ai order" + "```";
      //       return message.reply(mess).catch(console.error);
      //     } else {
      //       for (let i = 0; i <= Math.ceil(listOrder.length / 50); i += 1) {
      //         if (listOrder.slice(i * 50, (i + 1) * 50).length === 0) break;
      //         mess = listOrder
      //           .slice(i * 50, (i + 1) * 50)
      //           .map(
      //             (list) =>
      //               `<${list.username}> order ${list.menu.toUpperCase()}`
      //           )
      //           .join("\n");
      //         const Embed = new EmbedBuilder()
      //           .setTitle(`Chốt đơn!!! Tổng là ${listOrder.length} người`)
      //           .setColor("Red")
      //           .setDescription(`${mess}`);
      //         await message.reply({ embeds: [Embed] }).catch(console.error);
      //       }
      //     }
      //     const reportOrder = await orderData
      //       .createQueryBuilder("orders")
      //       .where(`"channelId" = :channelId`, {
      //         channelId: channelId,
      //       })
      //       .andWhere(`"isCancel" IS NOT True`, {
      //         isCancel: false,
      //       })
      //       .execute();
      //     reportOrder.map(async (item) => {
      //       await orderData
      //         .createQueryBuilder("orders")
      //         .update(Order)
      //         .set({ isCancel: true })
      //         .where(`id = :id`, { id: item.id })
      //         .execute();
      //     });
      //   } else {
      //     message.reply({
      //       content: "Bạn không thể chốt đơn!!!",
      //     });
      //   }
      // } else {
      //   const list = args.slice(0, args.length).join(" ");
      //   await orderData
      //     .insert({
      //       channelId: channelId,
      //       userId: author,
      //       username: username,
      //       menu: list,
      //       createdTimestamp: Date.now(),
      //       isCancel: false,
      //     })
      //     .catch((err) => console.log(err));
      //   message.reply({
      //     content: "`✅` Bạn đã đặt đơn!!!",
      //   });
      // }
    } catch (err) {
      console.log(err);
    }
  }
}
