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

  async getUserNotDaily(date: Date) {
    if (date && (date.getDay() === 0 || date.getDay() === 6 || date > new Date())) {
      return {
        notDaily: [],
        userNotDaily: [],
        notDailyMorning: [],
        notDailyFullday: [],
        notDailyAfternoon: [],
      };
    }

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
              httpsAgent: this.clientConfigService.https,
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

      let wfhMorning = [];
      let wfhAfternoon = [];
      let wfhFullday = [];
      let wfhUserEmail = [];
      if (wfhGetApi && wfhGetApi.data && wfhGetApi.data.result.length > 0) {
        wfhUserEmail = wfhGetApi.data.result.map((item) =>
          this.utilsService.getUserNameByEmail(item.emailAddress)
        );

        wfhMorning = wfhGetApi.data.result
        .filter(item => item.dateTypeName === "Morning")
        .map(item => this.utilsService.getUserNameByEmail(item.emailAddress));

        wfhAfternoon = wfhGetApi.data.result
        .filter(item => item.dateTypeName === "Afternoon")
        .map(item => this.utilsService.getUserNameByEmail(item.emailAddress));

        wfhFullday = wfhGetApi.data.result
        .filter(item => item.dateTypeName === "Fullday")
        .map(item => this.utilsService.getUserNameByEmail(item.emailAddress));

        // if no wfh
        if (
          (Array.isArray(wfhUserEmail) && wfhUserEmail.length === 0) ||
          !wfhUserEmail
        ) {
          return;
        }
      }

      const { userOffFullday } = await getUserOffWork(date);
      const userOff = [...wfhUserEmail, ...userOffFullday];
      const userNotWFH = await this.userRepository
        .createQueryBuilder("user")
        .where(
          userOff && userOff.length
            ? 'LOWER("email") NOT IN (:...userOff)'
            : "true",
          {
            userOff: userOff,
          }
        )
        .andWhere('("createdAt" < :today OR "createdAt" is NULL)', {
          today: Date.now() - 86400 * 1000,
        })
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

      const dailyEmailMorning = dailyMorning.map((item) =>
        item.email.toLowerCase()
      );
      const dailyEmailAfternoon = dailyAfternoon.map((item) =>
        item.email.toLowerCase()
      );
      const dailyEmailFullday = dailyFullday.map((item) =>
        item.email.toLowerCase()
      );

      const notDailyMorning = [];
      for (const wfhData of wfhUserEmail) {
        if(wfhMorning.includes(wfhData) || wfhFullday.includes(wfhData)) {
          if (
            !dailyEmailMorning.includes(wfhData.toLowerCase()) &&
            wfhData !== undefined
          ) {
            notDailyMorning.push(wfhData);
          }
        }
      }

      const notDailyAfternoon = [];
      for (const wfhData of wfhUserEmail) {
        if(wfhAfternoon.includes(wfhData) || wfhFullday.includes(wfhData)) {
          if (
            !dailyEmailAfternoon.includes(wfhData.toLowerCase()) &&
            wfhData !== undefined
          ) {
            notDailyAfternoon.push(wfhData);
          }
        }
      }

      const notDailyFullday = [];
      for (const userNotWFHData of userEmail) {
        if (
          !dailyEmailFullday.includes(userNotWFHData.toLowerCase()) &&
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
      // => notDaily : {email : "", count : }
      const notDaily = spreadNotDaily.reduce((acc, cur) => {
        if (Array.isArray(acc) && acc.length === 0) {
          acc.push({ email: cur, count: 1 });
        } else {
          const indexExist = acc.findIndex((item) => item.email === cur);
          if (indexExist !== -1) {
            acc[indexExist] = {
              email: acc[indexExist].email,
              count: acc[indexExist].count + 1,
            };
          } else {
            acc.push({ email: cur, count: 1 });
          }
        }
        return acc;
      }, []);

      let userNotDaily;
      let dayToMilliseconds = 86400 * 1000;
      try {
        userNotDaily = await Promise.all(
          notDaily.map((user) =>
            this.userRepository
              .createQueryBuilder('user')
              .where(`LOWER("email") = :email`, {
                email: user.email.toLowerCase(),
              })
              .orWhere(`LOWER("username") = :username`, {
                username: user.email.toLowerCase(),
              })
              .andWhere('("createdAt" < :today OR "createdAt" is NULL)', {
                today: Date.now() - dayToMilliseconds,
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
