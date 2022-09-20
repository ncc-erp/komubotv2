import { EmbedBuilder, Message } from "discord.js";
import { UntilService } from "src/bot/utils/until.service";
import { CommandLine, CommandLineClass } from "../../base/command.base";

import { OrderService } from "./order.service";

@CommandLine({
  name: "order",
  description: "order",
})
export class OrderCommand implements CommandLineClass {
  constructor(
    private orderService: OrderService,
    private untilService: UntilService
  ) {}

  async execute(message: Message, args) {
    const orderData = this.orderService;
    const channelId = message.channel.id;
    let author = message.author.id;
    let username = message.author.username;

    try {
      if (!args[0]) {
        return message.reply({
          content: "Order không được để trống!",
        });
      } else if (args[0] === "cancel") {
        const userCancel = await this.orderService.getUserCancelOrder(
          channelId,
          author,
          username
        );
        userCancel?.forEach(async (item) => {
          await this.orderService.upDateUserCancel(item);
        });

        // message.reply({
        //   content: "Bạn đã hủy đơn đặt hàng!!!",
        // });
      } else if (args[0] === "finish") {
        const userCancel = await orderData.getListUserOrderPending(
          channelId,
          author,
          username
        );
        if (userCancel && userCancel.length > 0) {
          const listOrder = await orderData.getListUserFinish(
            channelId,
            this.untilService.getYesterdayDate(),
            this.untilService.getTomorrowDate()
          );

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
                    `<${list.username}> order ${list.menu.toUpperCase()}`
                )
                .join("\n");
              const Embed = new EmbedBuilder()
                .setTitle(`Chốt đơn!!! Tổng là ${listOrder.length} người`)
                .setColor("Red")
                .setDescription(`${mess}`);
              await message.reply({ embeds: [Embed] }).catch(console.error);
            }
          }
          const reportOrder = await orderData.updateFinishOrder(channelId);
          reportOrder.map(async (item) => {
            await orderData.upDateUserCancel(item);
          });
        } else {
          message.reply({
            content: "Bạn không thể chốt đơn!!!",
          });
        }
      } else {
        const list = args.slice(0, args.length).join(" ");
        await orderData
          .order(channelId, author, username, list)
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
