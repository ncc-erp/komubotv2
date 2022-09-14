import { InjectRepository } from "@nestjs/typeorm";
import { formatDistance, subDays } from "date-fns";
import { Message, Client, EmbedBuilder } from "discord.js";
import { DataSource, Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../base/command.base";
import { TABLE } from "../constants/table";
import { Order } from "../models/order.entity";
import { OrderService } from "../service/order.service";
import { UntilService } from "../untils/until.service";

@CommandLine({
  name: "order",
  description: "order",
})
export default class OrderCommand implements CommandLineClass {
  constructor(
    @InjectRepository(Order)
    private orderReposistory: Repository<Order>,
    private orderService: OrderService
  ) {}

  async execute(message: Message, args, _, __, ___) {
    const orderData = this.orderReposistory;
    this.orderService.orderCommand(message, args, orderData, Order);
  }
}
