import { getUserOffWork } from "../getUserOffWork";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmbedBuilder } from "discord.js";
import { TABLE } from "src/bot/constants/table";
import { Daily } from "src/bot/models/daily.entity";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import { getDateDay, getUserNameByEmail } from "../getusernotdaily.utils";
import { UtilsService } from "../utils.service";
import axios from "axios";
@Injectable()
export class ReportDailyService {
  constructor(
    @InjectRepository(Daily)
    private dailyReposistory: Repository<Daily>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private utilsService: UtilsService
  ) {}

  async findCountNotDaily(arr, email) {
    const users = arr.filter((item) => item.email === email);
    return (await users[0]) ? users[0].countnotdaily : 1;
  }
  async reportDaily(date, message, args, client, guildDB) {
    try {
      let authorId = message.author.id;
      const { notDaily, userNotDaily } = await this.getUserNotDaily(
        date,
        message,
        args,
        client
      );

      let mess;
      const dateString = (date && date.toDateString()) || "";
      const dailyString = date
        ? "Những Người Chưa Daily"
        : "Những Người Chưa Daily Hôm Nay";
      if (!userNotDaily) {
        return;
      } else if (Array.isArray(userNotDaily) && userNotDaily.length === 0) {
        mess = "```" + dateString + "Tất Cả Đều Đã Daily" + "```";
        return message.reply(mess).catch((err) => {
          this.utilsService.sendErrorToDevTest(client, authorId, err);
        });
      } else {
        for (let i = 0; i <= Math.ceil(userNotDaily.length / 50); i += 1) {
          if (userNotDaily.slice(i * 50, (i + 1) * 50).length === 0) break;
          mess = userNotDaily
            .slice(i * 50, (i + 1) * 50)
            .map((user) => {
              if (user.id) {
                return `${user.email} (${this.findCountNotDaily(
                  notDaily,
                  user.username
                )})`;
              } else {
                return `${user.email} (${this.findCountNotDaily(
                  notDaily,
                  user.username
                )})`;
              }
            })
            .join("\n");
          const Embed = new EmbedBuilder()
            .setTitle(
              `${dateString}
              ${dailyString}`
            )
            .setColor("Red")
            .setDescription(`${mess}`);
          await message.reply({ embeds: [Embed] }).catch((err) => {
            this.utilsService.sendErrorToDevTest(client, authorId, err);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getUserNotDaily(date, message, args, client) {
    try {
      let wfhGetApi;
      try {
        const url = date
          ? `${client.config.wfh.api_url}?date=${date.toDateString()}`
          : `${process.env.TIMESHEET_API}Public/GetUserWorkFromHome`;

        wfhGetApi = await axios.get(url, {
          headers: {
            securitycode: process.env.WFH_API_KEY_SECRET,
          },
        });
      } catch (error) {
        console.log(error);
      }

      if (!wfhGetApi || wfhGetApi.data == undefined) {
        return;
      }

      const wfhUserEmail = wfhGetApi.data.result.map((item) =>
        getUserNameByEmail(item.emailAddress)
      );

      // if no wfh
      if (
        (Array.isArray(wfhUserEmail) && wfhUserEmail.length === 0) ||
        !wfhUserEmail
      ) {
        return;
      }

      const { userOffFullday } = await getUserOffWork(date);
      const userOff = [...wfhUserEmail, ...userOffFullday];
      const userNotWFH = await this.userRepository
        .createQueryBuilder(TABLE.USER)
        .where(`"email" NOT IN (:...userOff)`, {
          userOff: userOff,
        })
        .andWhere(`${TABLE.USER}.deactive = :deactive`, { deactive: true })
        .andWhere(`"roles_discord" @> :staff OR "roles_discord" @> :intern`, {
          staff: ["STAFF"],
          intern: ["INTERN"],
        })
        .select(`${TABLE.USER}.*`)
        .execute();

      const userEmail = userNotWFH.map((item) => item.email);

      const dailyMorning = await this.dailyReposistory
        .createQueryBuilder(TABLE.DAILY)
        .where(`${TABLE.DAILY}.createdAt < ${getDateDay(date).morning.lastime}`)
        .andWhere(
          `${TABLE.DAILY}.createdAt > ${getDateDay(date).morning.fisttime}`
        )
        .execute();

      const dailyAfternoon = await this.dailyReposistory
        .createQueryBuilder(TABLE.DAILY)
        .where(
          `${TABLE.DAILY}.createdAt < ${getDateDay(date).afternoon.lastime}`
        )
        .andWhere(
          `${TABLE.DAILY}.createdAt > ${getDateDay(date).afternoon.fisttime}`
        )
        .execute();

      const dailyFullday = await this.dailyReposistory
        .createQueryBuilder(TABLE.DAILY)
        .where(`${TABLE.DAILY}.createdAt < ${getDateDay(date).fullday.lastime}`)
        .andWhere(
          `${TABLE.DAILY}.createdAt > ${getDateDay(date).fullday.fisttime}`
        )
        .execute();

      const dailyEmailMorning = dailyMorning.map((item) => item.email);
      const dailyEmailAfternoon = dailyAfternoon.map((item) => item.email);
      const dailyEmailFullday = dailyFullday.map((item) => item.email);

      const notDailyMorning = [];
      for (const wfhData of wfhUserEmail) {
        if (!dailyEmailMorning.includes(wfhData) && wfhData !== undefined) {
          notDailyMorning.push(wfhData);
        }
      }
      const notDailyAfternoon = [];
      for (const wfhData of wfhUserEmail) {
        if (!dailyEmailAfternoon.includes(wfhData) && wfhData !== undefined) {
          notDailyAfternoon.push(wfhData);
        }
      }
      const notDailyFullday = [];
      for (const userNotWFHData of userEmail) {
        if (
          !dailyEmailFullday.includes(userNotWFHData) &&
          userNotWFHData !== undefined
        ) {
          notDailyFullday.push(userNotWFHData);
        }
      }

      const spreadNotDaily = [
        ...notDailyMorning,
        ...notDailyAfternoon,
        ...notDailyFullday,
      ];
      // => notDaily : {email : "", countnotdaily : }
      const notDaily = spreadNotDaily.reduce((acc, cur) => {
        if (Array.isArray(acc) && acc.length === 0) {
          acc.push({ email: cur, countnotdaily: 1 });
        } else {
          const indexExist = acc.findIndex((item) => item.email === cur);
          if (indexExist !== -1) {
            acc[indexExist] = {
              email: acc[indexExist].email,
              countnotdaily: acc[indexExist].countnotdaily + 1,
            };
          } else {
            acc.push({ email: cur, countnotdaily: 1 });
          }
        }
        return acc;
      }, []);

      let userNotDaily;
      try {
        userNotDaily = await Promise.all(
          notDaily.map((user) =>
            // userData.findOne({
            //   $or: [{ email: user.email }, { username: user.email }],
            //   deactive: { $ne: true },
            // })

            this.userRepository
              .createQueryBuilder(TABLE.USER)
              .where(`${TABLE.USER}.email = :email`, { email: user.email })
              .andWhere(`${TABLE.USER}.username = :username`, {
                username: user.email,
              })
              .andWhere(`${TABLE.USER}.deactive = :deactive`, {
                deactive: true,
              })
              .execute()
          )
        );
      } catch (error) {
        console.log(error);
      }

      for (let i = 0; i < userNotDaily.length; i++) {
        if (userNotDaily[i] === null) {
          userNotDaily[i] = notDaily[i];
        }
      }
      return { notDaily, userNotDaily, notDailyMorning, notDailyFullday };
    } catch (error) {
      console.log(error);
    }
  }
}
