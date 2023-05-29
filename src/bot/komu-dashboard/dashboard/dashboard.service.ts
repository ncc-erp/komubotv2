import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Daily } from "src/bot/models/daily.entity";
import { Meeting } from "src/bot/models/meeting.entity";
import { Msg } from "src/bot/models/msg.entity";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Channel } from "src/bot/models/channel.entity";
import { NodeSSH } from "node-ssh";
import { IReportKomubot, IReportMsg } from "./interfaces/dashboardInterface";

const startDay = startOfWeek(new Date()).getTime();
const endDay = endOfWeek(new Date()).getTime();
// const startDay = startOfDay(new Date()).getTime();
// const endDay = endOfDay(new Date()).getTime();
const office = [
  "VINH",
  "HANOI",
  "HANOI2",
  "HANOI3",
  "DANANG",
  "QUYNHON",
  "SAIGON",
  "SAIGON2",
];

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Daily)
    private dailyRepository: Repository<Daily>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Msg)
    private msgRepository: Repository<Msg>
  ) {}
  async getReportKomubot(): Promise<IReportKomubot> {
    try {
      const [
        totalUserActive,
        totalDailyOfToday,
        totalMsgOfToday,
        totalMeeting,
        totalChannel,
      ] = await Promise.all([
        this.reportUser(),
        this.reportDaily(startDay, endDay),
        this.reportMsg(startDay, endDay),
        this.reportMeeting(),
        this.reportChannel(),
      ]);

      return {
        result: {
          totalUserActive,
          totalDailyOfToday,
          totalMsgOfToday,
          totalMeeting,
          totalChannel,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async reportUser(): Promise<number> {
    try {
      return await this.userRepository
        .createQueryBuilder("user")
        .where('"deactive" IS NOT True')
        .andWhere('("roles_discord" @> :intern OR "roles_discord" @> :staff)', {
          intern: ["INTERN"],
          staff: ["STAFF"],
        })
        .getCount();
    } catch (error) {
      console.log(error);
    }
  }

  async reportDaily(startDay: number, endDay: number): Promise<number> {
    try {
      return await this.dailyRepository
        .createQueryBuilder("daily")
        .where(`"createdAt" >= :gtecreatedAt`, {
          gtecreatedAt: startDay,
        })
        .andWhere(`"createdAt" <= :ltecreatedAt`, {
          ltecreatedAt: endDay,
        })
        .getCount();
    } catch (error) {
      console.log(error);
    }
  }

  async reportMsg(startDay: number, endDay: number): Promise<number> {
    try {
      return await this.msgRepository
        .createQueryBuilder("msg")
        .where(`"createdTimestamp" >= :gtecreatedTimestamp`, {
          gtecreatedTimestamp: startDay,
        })
        .andWhere(`"createdTimestamp" <= :ltecreatedTimestamp`, {
          ltecreatedTimestamp: endDay,
        })
        .getCount();
    } catch (error) {
      console.log(error);
    }
  }

  async reportMeeting(): Promise<number> {
    try {
      return await this.meetingRepository
        .createQueryBuilder("meeting")
        .where('"cancel" IS NOT True')
        .getCount();
    } catch (error) {
      console.log(error);
    }
  }

  async reportChannel(): Promise<number> {
    try {
      return await this.channelRepository
        .createQueryBuilder("channel")
        .getCount();
    } catch (error) {
      console.log(error);
    }
  }

  async getReportMsg(): Promise<IReportMsg> {
    try {
      const locationCounts = await this.getReportMsgOfOfice(startDay, endDay);

      return {
        result: locationCounts,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async streamFile() {
    try {
      const ssh = new NodeSSH();

      ssh
        .connect({
          host: "172.16.100.114",
          username: "nccsoft",
          password: "12345678a@",
        })
        .then(async () => {
          const outLogContent = await ssh.execCommand(
            "cat ~/.pm2/logs/komucrawlv2-error.log"
          );
          return { result: outLogContent.stdout };
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          ssh.dispose();
        });
    } catch (error) {
      console.log(error);
    }
  }

  async getReportMsgMonthly() {
    try {
      const startDateOfMonth = startOfMonth(new Date()).getTime();
      const endDateOfMonth = endOfMonth(new Date()).getTime();

      const locationCounts = await this.getReportMsgOfOfice(
        startDateOfMonth,
        endDateOfMonth
      );

      return {
        result: locationCounts,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getReportMsgOfOfice(startDate: number, endDate: number): Promise<any> {
    try {
      const locationCounts = {
        VINH: 0,
        HANOI: 0,
        HANOI2: 0,
        HANOI3: 0,
        DANANG: 0,
        QUYNHON: 0,
        SAIGON: 0,
        SAIGON2: 0,
      };

      const dataMsgPromises = office.map(async (item) => {
        return this.msgRepository
          .createQueryBuilder("msg")
          .innerJoin("komu_user", "m", "msg.authorId = m.userId")
          .where(`"createdTimestamp" >= :gtecreatedTimestamp`, {
            gtecreatedTimestamp: startDate,
          })
          .andWhere(`"createdTimestamp" <= :ltecreatedTimestamp`, {
            ltecreatedTimestamp: endDate,
          })
          .andWhere('("roles_discord" @> :roles_discord)', {
            roles_discord: [item],
          })
          .getCount();
      });

      const dataMsgs = await Promise.all(dataMsgPromises);

      office.forEach((item, index) => {
        locationCounts[item] = dataMsgs[index];
      });

      return locationCounts;
    } catch (error) {
      console.log(error);
    }
  }
}
