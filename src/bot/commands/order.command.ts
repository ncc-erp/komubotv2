import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Message,  } from "discord.js";
import { DataSource, Repository } from "typeorm";
import { CommandLine, CommandLineClass } from "../base/command.base";
import { TABLE } from "../constants/table";
import { Order } from "../models/order.entity";
import {UntilService} from '../untils/until.service';

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
export class OrderCommand implements CommandLineClass {
  constructor(
    private orderService: OrderService
  ) {}

  async execute(message: Message, args,) {
    this.orderService.orderCommand(message, args)
  }
}
