import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WomenDay } from "src/bot/models/womenDay.entity";
import { Repository } from "typeorm";
import { UtilsService } from "../utils.service";

@Injectable()
export class ReportWomenDayService {
  constructor(
    @InjectRepository(WomenDay)
    private womenDayReposistory: Repository<WomenDay>
  ) {}

  async reportWomenDay(message) {
    try {
      const userWin = await this.womenDayReposistory.find({
        where: {
          win: true,
        },
      });

      let mess: any;
      if (!userWin) {
        return;
      } else if (Array.isArray(userWin) && userWin.length === 0) {
        mess = "```" + "Không có ai trúng thưởng" + "```";
        return message.reply(mess).catch(console.error);
      } else {
        for (let i = 0; i <= Math.ceil(userWin.length / 50); i += 1) {
          if (userWin.slice(i * 50, (i + 1) * 50).length === 0) break;
          mess =
            "```" +
            "Những người may mắn được nhận quà: " +
            "```" +
            userWin
              .slice(i * 50, (i + 1) * 50)
              .map((userW) => `<@${userW.userid}> : ${userW.gift}`)
              .join("\n");
          message.reply(mess).catch(console.error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
