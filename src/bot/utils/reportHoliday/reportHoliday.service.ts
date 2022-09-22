import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmbedBuilder } from "discord.js";
import { Holiday } from "src/bot/models/holiday.entity";
import { Repository } from "typeorm";
import { UtilsService } from "../utils.service";

@Injectable()
export class ReportHolidayService {
  constructor(
    @InjectRepository(Holiday)
    private holidayReposistory: Repository<Holiday>,
    private utils: UtilsService,
  ) {}

  async reportHoliday(message, args, client) {
    let authorId = message.author.id;
    const today = Date.now();
    const getYear = new Date(today).getFullYear();
    const holiday = await this.holidayReposistory.find();

    let mess: any;
    if (!holiday) {
      return;
    } else if (Array.isArray(holiday) && holiday.length === 0) {
      mess = "```" + "Không có lịch nghỉ lễ nào" + "```";
      return message.reply(mess).catch((err) => {
        this.utils.sendErrorToDevTest(client, authorId, err);
      });
    } else {
      for (let i = 0; i <= Math.ceil(holiday.length / 50); i += 1) {
        if (holiday.slice(i * 50, (i + 1) * 50).length === 0) break;
        mess = holiday
          .slice(i * 50, (i + 1) * 50)
          .filter((item) => item.dateTime.slice(6) === getYear.toString())
          .map((check) => `${check.dateTime} ${check.content}`)
          .join("\n");
        const Embed = new EmbedBuilder()
          .setTitle("Các ngày nghỉ lễ trong năm")
          .setColor("Red")
          .setDescription(`${mess}`);
        await message.reply({ embeds: [Embed] }).catch((err) => {
          this.utils.sendErrorToDevTest(client, authorId, err);
        });
      }
    }
  }
}
