import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { Repository } from "typeorm";
import { UtilsService } from "../utils.service";
import { Client, EmbedBuilder, Message } from "discord.js";
import { Injectable } from "@nestjs/common";
import { KomubotrestService } from "../komubotrest/komubotrest.service";

@Injectable()
export class ReportWFHService {
  constructor(
    @InjectRepository(WorkFromHome)
    private wfhRepository: Repository<WorkFromHome>,
    private komubotrestService: KomubotrestService,
    private utilsService: UtilsService
  ) {}

  async reportWfh(message: Message, args, client: Client) {
    let authorId = message.author.id;
    let fomatDate;
    if (args[1]) {
      const day = args[1].slice(0, 2);
      const month = args[1].slice(3, 5);
      const year = args[1].slice(6);

      fomatDate = `${month}/${day}/${year}`;
    } else {
      fomatDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    const wfhFullday = await this.wfhRepository
      .createQueryBuilder(TABLE.WFH)
      .leftJoinAndSelect(`${TABLE.WFH}.user`, "user")
      .where(`${TABLE.WFH}.type = :type`, { type: "wfh" })
      .andWhere(
        `${TABLE.WFH}.createdAt > ${this.utilsService
          .getTimeToDay(fomatDate)
          .firstDay.getTime()}`
      )
      .andWhere(
        `${TABLE.WFH}.createdAt < ${this.utilsService
          .getTimeToDay(fomatDate)
          .lastDay.getTime()}`
      )
      .orWhere(`${TABLE.WFH}.status = :status`, { status: "ACCEPT" })
      .orWhere(`${TABLE.WFH}.status = :status`, { status: "ACTIVE" })
      .orWhere(`${TABLE.WFH}.status = :status`, {
        status: "APPROVED",
        pmconfirm: false,
      })
      .select(`SUM(${TABLE.USER}.userId)`, "sum")
      .groupBy("userid")
      .execute();

    let mess;
    if (!wfhFullday) {
      return;
    } else if (Array.isArray(wfhFullday) && wfhFullday.length === 0) {
      mess = "```" + "Không có ai vi phạm trong ngày" + "```";
      return message.reply(mess).catch((err) => {
        this.komubotrestService.sendErrorToDevTest(client, authorId, err);
      });
    } else {
      for (let i = 0; i <= Math.ceil(wfhFullday.length / 50); i += 1) {
        if (wfhFullday.slice(i * 50, (i + 1) * 50).length === 0) break;
        mess = wfhFullday
          .slice(i * 50, (i + 1) * 50)
          .map((wfh) => `<@${wfh._id}>(${wfh.username}) - (${wfh.total})`)
          .join("\n");
        const Embed = new EmbedBuilder()
          .setTitle(
            "Những người bị phạt vì không trả lời wfh trong ngày hôm nay"
          )
          .setColor("Red")
          .setDescription(`${mess}`);
        return message.reply({ embeds: [Embed] }).catch((err) => {
          this.komubotrestService.sendErrorToDevTest(client, authorId, err);
        });
      }
    }
  }

  async reportCompalinWfh(message, args, client) {
    let authorId = message.author.id;
    let fomatDate;
    if (args[2]) {
      const day = args[2].slice(0, 2);
      const month = args[2].slice(3, 5);
      const year = args[2].slice(6);

      fomatDate = `${month}/${day}/${year}`;
    } else {
      fomatDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    const wfhFullday = await this.wfhRepository
      .createQueryBuilder(TABLE.WFH)
      .where(`${TABLE.WFH}.status = :status`, { status: "APPROVED" })
      .andWhere(`${TABLE.WFH}.complain = :complain`, { complain: true })
      .andWhere(
        `${TABLE.WFH}.createdAt > ${this.utilsService
          .getTimeToDay(fomatDate)
          .firstDay.getTime()}`
      )
      .andWhere(
        `${TABLE.WFH}.createdAt < ${this.utilsService
          .getTimeToDay(fomatDate)
          .lastDay.getTime()}`
      )
      .execute();

    let mess;
    if (!wfhFullday) {
      return;
    } else if (Array.isArray(wfhFullday) && wfhFullday.length === 0) {
      mess = "```" + "Không có ai được approved trong ngày" + "```";
      return message.reply(mess).catch((err) => {
        this.komubotrestService.sendErrorToDevTest(client, authorId, err);
      });
    } else {
      for (let i = 0; i <= Math.ceil(wfhFullday.length / 50); i += 1) {
        if (wfhFullday.slice(i * 50, (i + 1) * 50).length === 0) break;
        mess = wfhFullday
          .slice(i * 50, (i + 1) * 50)
          .map((wfh) => `<@${wfh.userid}> `)
          .join("\n");
        const Embed = new EmbedBuilder()
          .setTitle("Những người được approved trong ngày hôm nay")
          .setColor("Red")
          .setDescription(`${mess}`);
        return message.reply({ embeds: [Embed] }).catch((err) => {
          this.komubotrestService.sendErrorToDevTest(client, authorId, err);
        });
      }
    }
  }
}
