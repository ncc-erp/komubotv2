import { InjectRepository } from "@nestjs/typeorm";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { Repository } from "typeorm";
import { UtilsService } from "../utils.service";
import { Injectable } from "@nestjs/common";
import { EmbedBuilder } from "discord.js";
import { KomubotrestService } from "../komubotrest/komubotrest.service";

@Injectable()
export class ReportMentionService {
  constructor(
    @InjectRepository(WorkFromHome)
    private wfhRepository: Repository<WorkFromHome>,
    private komubotrestService: KomubotrestService,
    private utilsService: UtilsService
  ) {}

  async reportMention(message, client) {
    const authorId = message.author.id;
    const mentionFullday = await this.wfhRepository
      .createQueryBuilder("wfhs,users")
      .leftJoinAndSelect("user.userId", "users")
      .where('"wfhs.type" = :type', { type: "wfh" })
      .andWhere(
        `"wfhs.createdAt" > ${this.utilsService.getTimeToDayMention().firstDay}`
      )
      .andWhere(
        `"wfhs.createdAt" < ${this.utilsService.getTimeToDayMention().lastDay}`
      )
      .orWhere('"wfhs.status" = :status', { status: "ACCEPT" })
      .orWhere('"wfhs.status" = :status', { status: "ACTIVE" })
      .orWhere('"wfhs.status" = :status', {
        status: "APPROVED",
        pmconfirm: false,
      })
      .select('SUM("wfhs.userId")', "sum")
      .groupBy("userid")
      .execute();
    let mess;
    if (!mentionFullday) {
      return;
    } else if (Array.isArray(mentionFullday) && mentionFullday.length === 0) {
      mess = "```" + "Không có ai vi phạm trong ngày" + "```";
      return message.reply(mess).catch((err) => {
        this.komubotrestService.sendErrorToDevTest(client, authorId, err);
      });
    } else {
      for (let i = 0; i <= Math.ceil(mentionFullday.length / 50); i += 1) {
        if (mentionFullday.slice(i * 50, (i + 1) * 50).length === 0) break;
        mess = mentionFullday
          .slice(i * 50, (i + 1) * 50)
          .map((mention) => `${mention.username} (${mention.total})`)
          .join("\n");
        const Embed = new EmbedBuilder()
          .setTitle("Những người không trả lời mention trong ngày hôm nay")
          .setColor("Red")
          .setDescription(`${mess}`);
        await message.reply({ embeds: [Embed] }).catch((err) => {
          this.komubotrestService.sendErrorToDevTest(client, authorId, err);
        });
      }
    }
  }
}
