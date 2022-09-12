import { Injectable } from "@nestjs/common";

@Injectable()
export class BotService {
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
