import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "src/bot/models/order.entity";
import { OrderService } from "./order.service";

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  exports: [OrderService],
  providers: [OrderService],
})
export class OrderModule {}
