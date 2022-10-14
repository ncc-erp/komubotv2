import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, Message } from "discord.js";
import { firstValueFrom } from "rxjs";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { Daily } from "src/bot/models/daily.entity";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import { getUserOffWork } from "../getUserOffWork";
import { UtilsService } from "../utils.service";

@Injectable()
export class UserNotDailyService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Daily)
    private dailyRepository: Repository<Daily>,
    private readonly http: HttpService,
    private clientConfigService: ClientConfigService
  ) {}

  async getUserNotDaily(date, message: Message, args, client: Client) {
    try {
      let wfhGetApi;
      try {
        const url = date
          ? `${
              this.clientConfigService.wfh.api_url
            }?date=${date.toDateString()}`
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
        .createQueryBuilder("user")
        .where(
          userOff && userOff.length ? '"email" NOT IN (:...userOff)' : "true",
          {
            userOff: userOff,
          }
        )
        .andWhere('("roles_discord" @> :intern OR "roles_discord" @> :staff)', {
          intern: ["INTERN"],
          staff: ["STAFF"],
        })
        .andWhere(`"deactive" IS NOT TRUE`)
        .select("*")
        .execute();

      const userEmail = userNotWFH.map((item) => item.email);

      const dailyMorning = await this.dailyRepository
        .createQueryBuilder()
        .where(`"createdAt" >= :gtecreatedAt`, {
          gtecreatedAt: this.utilsService.getDateDay(date).morning.fisttime,
        })
        .andWhere(`"createdAt" <= :ltecreatedAt`, {
          ltecreatedAt: this.utilsService.getDateDay(date).morning.lastime,
        })
        .select("*")
        .execute();

      const dailyAfternoon = await this.dailyRepository
        .createQueryBuilder()
        .where(`"createdAt" >= :gtecreatedAt`, {
          gtecreatedAt: this.utilsService.getDateDay(date).afternoon.fisttime,
        })
        .andWhere(`"createdAt" <= :ltecreatedAt`, {
          ltecreatedAt: this.utilsService.getDateDay(date).afternoon.lastime,
        })
        .select("*")
        .execute();

      const dailyFullday = await this.dailyRepository
        .createQueryBuilder()
        .where(`"createdAt" >= :gtecreatedAt`, {
          gtecreatedAt: this.utilsService.getDateDay(date).fullday.fisttime,
        })
        .andWhere(`"createdAt" <= :ltecreatedAt`, {
          ltecreatedAt: this.utilsService.getDateDay(date).fullday.lastime,
        })
        .select("*")
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
            this.userRepository
              .createQueryBuilder()
              .where(`"email" = :email`, {
                email: user.email,
              })
              .orWhere(`"username" = :username`, {
                username: user.email,
              })
              .andWhere(`"deactive" IS NOT TRUE`)
              .select("*")
              .getRawOne()
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
      return {
        notDaily,
        userNotDaily,
        notDailyMorning,
        notDailyFullday,
        notDailyAfternoon,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
