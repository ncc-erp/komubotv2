import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { UtilsService } from "../../utils/utils.service";
import { CronJob } from "cron";
import { SchedulerRegistry, CronExpression } from "@nestjs/schedule";
import { ChannelType, Client } from "discord.js";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { Dating } from "src/bot/models/dating.entity";
import { JoinCall } from "src/bot/models/joinCall.entity";
import { User } from "src/bot/models/user.entity";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ClientConfigService } from "src/bot/config/client-config.service";

@Injectable()
export class DatingSchedulerService {
  constructor(
    private utilsService: UtilsService,
    @InjectRepository(Dating)
    private datingRepository: Repository<Dating>,
    @InjectRepository(JoinCall)
    private joinCallRepository: Repository<JoinCall>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private schedulerRegistry: SchedulerRegistry,
    @InjectDiscordClient()
    private client: Client,
    private readonly http: HttpService,
    private configClient: ClientConfigService
  ) {}

  private readonly logger = new Logger(DatingSchedulerService.name);

  addCronJob(name: string, time: string, callback: () => void): void {
    const job = new CronJob(
      time,
      () => {
        this.logger.warn(`time (${time}) for job ${name} to run!`);
        callback();
      },
      null,
      true,
      "Asia/Ho_Chi_Minh"
    );

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(`job ${name} added for each minute at ${time} seconds!`);
  }

  // Start cron job
  startCronJobs(): void {
    this.addCronJob("dating", '0-15/1 17 * * 5', () =>
      this.dating(this.client)
    );
  }

  async dating(client) {
    if (await this.utilsService.checkHoliday()) return;
    const now = new Date();
    const minute = now.getMinutes();
    const dating = [];
    const datingIdMan = [];
    const datingIdWoman = [];
    const datingEmailMAn = [];
    const datingEmailWoman = [];
    const resCheckUserMan = [];
    const resCheckUserWoman = [];
    const listJoinCall = [];

    if (minute === 0) {
      const response = await firstValueFrom(
        this.http
          .get(
            "http://timesheetapi.nccsoft.vn/api/services/app/Public/GetAllUser"
          )
          .pipe((res) => res)
      );
      if (!response.data || !response.data.result) return;

      const userMan = [];
      const userWomen = [];
      response.data.result.map((item) => {
        if (item.sex === 0)
          userMan.push({
            email: this.utilsService.getUserNameByEmail(item.emailAddress),
            branch: item.branchId,
          });
        if (item.sex === 1)
          userWomen.push({
            email: this.utilsService.getUserNameByEmail(item.emailAddress),
            branch: item.branchId,
          });
      });

      let emailUserMan = [];
      let emailUserWomen = [];
      userMan.map((item) => {
        if (!item.email) return;
        emailUserMan.push(item.email);
      });
      userWomen.map((item) => {
        if (!item.email) return;
        emailUserWomen.push(item.email);
      });

      let result = [];
      const userDating = await this.datingRepository.find();
      userDating.map(async (item) => {
        result.push(item.email);
      });

      const checkJoinCall = await this.joinCallRepository.find({
        where: {
          status: "joining",
        },
      });
      checkJoinCall.map(async (item) => {
        listJoinCall.push(item.userId);
      });

      const checkUserMan = await this.userRepository
        .createQueryBuilder("users")
        .where(
          emailUserMan && emailUserMan.length > 0
            ? '"email" IN (:...emailUserMan)'
            : "true",
          {
            emailUserMan: emailUserMan,
          }
        )
        .andWhere(
          result && result.length > 0 ? '"email" NOT IN (:...result)' : "true",
          {
            result: result,
          }
        )
        .andWhere(
          listJoinCall && listJoinCall.length > 0
            ? '"userId" NOT IN (:...listJoinCall)'
            : "true",
          {
            listJoinCall: listJoinCall,
          }
        )
        .andWhere(`"deactive" IS NOT TRUE`)
        .select("users.*")
        .execute();

      const checkUserWoman = await this.userRepository
        .createQueryBuilder("users")
        .where(
          emailUserWomen && emailUserWomen.length > 0
            ? '"email" IN (:...emailUserWomen)'
            : "true",
          {
            emailUserWomen: emailUserWomen,
          }
        )
        .andWhere(
          result && result.length > 0 ? '"email" NOT IN (:...result)' : "true",
          {
            result: result,
          }
        )
        .andWhere(
          listJoinCall && listJoinCall.length > 0
            ? '"userId" NOT IN (:...listJoinCall)'
            : "true",
          {
            listJoinCall: listJoinCall,
          }
        )
        .andWhere(`"deactive" IS NOT TRUE`)
        .select("users.*")
        .execute();

      if (!checkUserMan || !checkUserWoman) return;

      let guild = client.guilds.fetch(this.configClient.guild_komu_id);
      const getAllVoice = client.channels.cache.filter(
        (guild) =>
          guild.type === ChannelType.GuildVoice &&
          guild.parentId === this.configClient.guildvoice_parent_id
      );
      const voiceChannel = getAllVoice.map((item) => item.id);
      let roomMap = [];
      let countVoice = 0;

      for (let i = 0; i < 5; i++) {
        let checkCaseMan = [];
        let checkCaseWoman = [];
        const arr = [0, 1, 2, 3];
        let randomOne = Math.floor(Math.random() * arr.length);
        let arrMan = arr[randomOne];
        arr.splice(arrMan, 1);
        let randomTwo = Math.floor(Math.random() * arr.length);
        let arrWoman = arr[randomTwo];

        userMan.map((man) => {
          if (man.branch === arrMan && man.email) checkCaseMan.push(man.email);
        });

        userWomen.map((women) => {
          if (women.branch === arrWoman && women.email)
            checkCaseWoman.push(women.email);
        });

        checkUserMan.map((item) => {
          resCheckUserMan.push(item.email);
        });
        const datingUserMan = resCheckUserMan.filter((item) =>
          checkCaseMan.includes(item)
        );

        checkUserWoman.map((item) => {
          resCheckUserWoman.push(item.email);
        });

        const datingUserWoman = resCheckUserWoman.filter((item) =>
          checkCaseWoman.includes(item)
        );

        if (datingUserMan.length > 0 && datingUserWoman.length > 0) {
          const indexMan = Math.floor(Math.random() * datingUserMan.length);
          const indexWoman = Math.floor(Math.random() * datingUserWoman.length);
          const randomMan = datingUserMan[indexMan];
          const randomWoman = datingUserWoman[indexWoman];
          dating.push(randomMan, randomWoman);

          checkUserMan.map((item) => {
            dating.map((dt) => {
              if (item.email === dt && !datingIdMan.includes(item.userId)) {
                datingIdMan.push(item.userId);
                datingEmailMAn.push(item.email);
              }
            });
          });
          checkUserWoman.map((item) => {
            dating.map((dt) => {
              if (item.email === dt && !datingIdWoman.includes(item.userId)) {
                datingIdWoman.push(item.userId);
                datingEmailWoman.push(item.email);
              }
            });
          });
        } else continue;
      }

      voiceChannel.map(async (voice, index) => {
        const userDiscord = await client.channels.fetch(voice);

        if (userDiscord.members.size > 0) {
          countVoice++;
        }
        if (userDiscord.members.size === 0) {
          roomMap.push(userDiscord.id);
        }
        if (index === voiceChannel.length - 1) {
          if (countVoice === voiceChannel.length) {
            {
              const fetchChannelFull = await client.channels.fetch(
                this.configClient.chuyenphiem_id
              );
              fetchChannelFull.send(`Voice channel full`);
            }
          } else {
            const nowFetchChannel = await client.channels.fetch(
              this.configClient.chuyenphiem_id
            );
            for (let i = 0; i < datingIdWoman.length; i++) {
              if (roomMap.length !== 0) {
                await nowFetchChannel.send(
                  `Hãy vào <#${roomMap[0]}> trò chuyện cuối tuần thôi nào <@${datingIdMan[i]}> <@${datingIdWoman[i]}>`
                );
                await this.datingRepository
                  .insert({
                    channelId: roomMap[0],
                    userId: datingIdMan[i],
                    email: datingEmailMAn[i],
                    createdTimestamp: Date.now(),
                    sex: 0,
                    loop: i,
                  })
                  .catch((err) => console.log(err));

                await this.datingRepository
                  .insert({
                    channelId: roomMap[0],
                    userId: datingIdWoman[i],
                    email: datingEmailWoman[i],
                    createdTimestamp: Date.now(),
                    sex: 1,
                    loop: i,
                  })
                  .catch((err) => console.log(err));

                roomMap.shift();
              } else nowFetchChannel.send(`Voice channel full`);
            }
          }
        }
      });
    }

    if (minute > 0 && minute < 15) {
      let idManPrivate = [];
      let idWomanPrivate = [];
      let idVoice = [];

      const timeNow = new Date();
      const timeStart = timeNow.setHours(0, 0, 0, 0);
      const timeEnd = timeNow.setHours(23, 0, 0, 0);
      const findDating = await this.datingRepository
        .createQueryBuilder()
        .where(`"createdTimestamp" >= :gtecreatedTimestamp`, {
          gtecreatedTimestamp: timeStart,
        })
        .andWhere(`"createdTimestamp" <= :ltecreatedTimestamp`, {
          ltecreatedTimestamp: timeEnd,
        })
        .orderBy("loop", "ASC")
        .select("*")
        .execute();

      findDating.map((item) => {
        if (item.sex === 0) {
          idManPrivate.push(item.userId);
          idVoice.push(item.channelId);
        } else idWomanPrivate.push(item.userId);
      });

      let fetchGuild = client.guilds.fetch(this.configClient.guild_komu_id);
      const getAllVoicePrivate = client.channels.cache.filter(
        (guild) =>
          guild.type === ChannelType.GuildVoice && guild.parentId === this.configClient.topCategoryId
      );
      const voiceChannelPrivate = getAllVoicePrivate.map((item) => item.id);
      let roomMapPrivate = [];

      voiceChannelPrivate.map(async (voice, index) => {
        const userDiscordPrivate = await client.channels.fetch(voice);

        roomMapPrivate.push(userDiscordPrivate.id);
        if (index === voiceChannelPrivate.length - 1) {
          for (let i = 0; i < idWomanPrivate.length; i++) {
            const fetchVoiceNcc8 = await client.channels.fetch(idVoice[i]);
            if (fetchVoiceNcc8.guild.members) {
              const targetMan = await fetchVoiceNcc8.guild.members.fetch(
                idManPrivate[i]
              );
              if (
                targetMan &&
                targetMan.voice &&
                targetMan.voice.channelId &&
                targetMan.voice.channelId !== roomMapPrivate[i]
              )
                targetMan.voice.setChannel(roomMapPrivate[i]);
              const targetWoman = await fetchVoiceNcc8.guild.members.fetch(
                idWomanPrivate[i]
              );
              if (
                targetWoman &&
                targetWoman.voice &&
                targetWoman.voice.channelId &&
                targetWoman.voice.channelId !== roomMapPrivate[i]
              )
                targetWoman.voice.setChannel(roomMapPrivate[i]);
            }
          }
        }
      });
    }
  }
}
