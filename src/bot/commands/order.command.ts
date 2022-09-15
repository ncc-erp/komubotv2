import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Message,  } from "discord.js";
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
export class OrderCommand implements CommandLineClass {
  constructor(
    private orderService: OrderService
  ) {}

  async execute(message: Message, args,) {
    this.orderService.orderCommand(message, args)
  }
}
