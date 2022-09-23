// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { Order } from "../models/order.entity";
// import { UtilsService } from "./utils.service";
// import { Message, EmbedBuilder } from "discord.js";

// export class ReportOrder {
//   constructor(
//     @InjectRepository(Order)
//     private orderReposistory: Repository<Order>,
//     private utilService: UtilsService
//   ) {}
//   async order(message) {
//     try {
//       const channelId = message.channel.id;
//       const channel = message.channelId;
//       const order = await this.orderReposistory
//         .createQueryBuilder("orders")
//         .select("username")
//         .addSelect('MAX("createdTimestamp")', "timeStamp")
//         .where(`"channelId" = :channelId`, {
//           channelId: channelId,
//         })
//         .andWhere(`"isCancel" IS NOT TRUE`)
//         .andWhere(`"createdTimestamp" > ${this.utilService.getYesterdayDate()}`)
//         .andWhere(`"createdTimestamp" < ${this.utilService.getTomorrowDate()}`)
//         .groupBy("username")
//         .execute();

//       const listOrder = await this.orderReposistory
//         .createQueryBuilder("orders")
//         .where('"createdTimestamp" IN (:...time_stamps)', {
//           time_stamps: order.map((item) => item.timeStamp),
//         })
//         .select("orders.*")
//         .execute();
//       let mess;
//       if (!listOrder) {
//         return;
//       } else if (Array.isArray(listOrder) && listOrder.length === 0) {
//         mess = "```" + "Không có ai order" + "```";
//         return message.reply(mess).catch(console.error);
//       } else {
//         for (let i = 0; i <= Math.ceil(listOrder.length / 50); i += 1) {
//           if (listOrder.slice(i * 50, (i + 1) * 50).length === 0) break;
//           mess = listOrder
//             .slice(i * 50, (i + 1) * 50)
//             .map(
//               (list) => `<${list.username}> order ${list.menu.toUpperCase()}`
//             )
//             .join("\n");
//           const Embed = new EmbedBuilder()
//             .setTitle(`Chốt đơn!!! Tổng là ${listOrder.length} người`)
//             .setColor("Red")
//             .setDescription(`${mess}`);
//           await message.reply({ embeds: [Embed] }).catch(console.error);
//         }
//       }
//     } catch (error) {}
//   }
// }
