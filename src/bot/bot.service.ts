import { Body, HttpCode, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TABLE } from "./constants/table";
import { Order } from "./models/order.entity";

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(Order)
    private orderReposistory: Repository<Order>
  ) {}

  getUserCancel(req, res) {
    req(":channelId", ":userId");
    return res.data;
  }

  findAll() {
    return this.orderReposistory.find();
  }

  getUserIdByUsername(req, res) {}
  sendMessageToUser(req, res) {}
  sendMessageToChannel(req, res) {}
  sendImageCheckInToUser(req, res) {}
  sendImageLabelToUser(req, res) {}
  sendMessageToMachLeo(req, res) {}
  sendMessageToThongBao(req, res) {}
  sendMessageToThongBaoPM(req, res) {}
  sendMessageToFinance(req, res) {}
  deleteMessage(req, res) {}
}
