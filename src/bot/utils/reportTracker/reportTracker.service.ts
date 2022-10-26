import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, EmbedBuilder, Message } from "discord.js";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import { UtilsService } from "../utils.service";
// import { AWClient } from "aw-client";
import { intervalToDuration } from "date-fns";
import { TrackerSpentTime } from "src/bot/models/trackerSpentTime.entity";
import { KomubotrestService } from "../komubotrest/komubotrest.service";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ClientConfigService } from "src/bot/config/client-config.service";
import axios from "axios";
@Injectable()
export class ReportTrackerService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TrackerSpentTime)
    private trackerSpentTimeRepository: Repository<TrackerSpentTime>,
    private utilsService: UtilsService,
    private readonly http: HttpService,
    private readonly clientConfigService: ClientConfigService,
    private komubotrestService: KomubotrestService
  ) {}

  messTrackerHelp =
    "```" +
    "*report tracker daily" +
    "\n" +
    "*report tracker daily a.nguyenvan" +
    "\n" +
    "*report tracker weekly" +
    "\n" +
    "*report tracker weekly a.nguyenvan" +
    "\n" +
    "*report tracker time" +
    "\n" +
    "*report tracker time a.nguyenvan" +
    "\n" +
    "*report tracker dd/MM/YYYY" +
    "\n" +
    "*report tracker dd/MM/YYYY a.nguyenvan" +
    "```";

  messHelpDaily = "```" + "Không có bản ghi nào trong ngày hôm qua" + "```";
  messHelpWeekly = "```" + "Không có bản ghi nào trong tuần qua" + "```";
  messHelpDate = "```" + "Không có bản ghi nào trong ngày này" + "```";
  messHelpTime = "```" + "Không có bản ghi nào" + "```";

  async getUserWFH(date, message: Message, args, client: Client) {
    let wfhGetApi;
    try {
      const url = date
        ? `${this.clientConfigService.wfh.api_url}?date=${date}`
        : this.clientConfigService.wfh.api_url;
      wfhGetApi = await firstValueFrom(
        this.http
          .get(url, {
            headers: {
              // WFH_API_KEY_SECRET
              securitycode: this.clientConfigService.wfhApiKey,
            },
          })
          .pipe((res) => res)
      );
    } catch (error) {
      console.log(error);
    }

    if (!wfhGetApi || wfhGetApi.data == undefined) {
      return;
    }

    const wfhUserEmail = wfhGetApi.data.result.map((item) =>
      this.utilsService.getUserNameByEmail(item.emailAddress)
    );

    if (
      (Array.isArray(wfhUserEmail) && wfhUserEmail.length === 0) ||
      !wfhUserEmail
    ) {
      return;
    }

    return wfhUserEmail;
  }

  async reportTracker(message: Message, args, client) {
    try {
      const result = await axios.get(
        `http://tracker.komu.vn:5600/api/0/report?day=${args[1]}`,
        { headers: { secret: "ScjP6mX2yA" } }
      );

      const checkUserWfh = result.data.filter(async (item) => {
        item.wfh == true;
      });

      let mess: any;
      if (!checkUserWfh) {
        return;
      } else if (Array.isArray(checkUserWfh) && checkUserWfh.length === 0) {
        mess = "```" + "Không có ai vi phạm" + "```";
        return message.reply(mess).catch(console.error);
      } else {
        for (let i = 0; i <= Math.ceil(checkUserWfh.length / 50); i += 1) {
          if (checkUserWfh.slice(i * 50, (i + 1) * 50).length === 0) break;
          mess = checkUserWfh
            .slice(i * 50, (i + 1) * 50)
            .map(
              (list) =>
                `<${list.email}> time: ${(
                  (list.spent_time + list.call_time) /
                  3600
                ).toFixed(2)}`
            )
            .join("\n");
          const Embed = new EmbedBuilder()
            .setTitle(
              `Danh sách tracker ngày hôm nay tổng là ${checkUserWfh.length} người`
            )
            .setColor("Red")
            .setDescription(`${mess}`);
          await message.reply({ embeds: [Embed] }).catch(console.error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
