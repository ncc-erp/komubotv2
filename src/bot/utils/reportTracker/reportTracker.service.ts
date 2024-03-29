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
        {
          headers: {
            "X-Secret-Key": this.clientConfigService.komuTrackerApiKey,
          },
        }
      );

      const { data } = result;
      const userWfh = data.filter((e) => e.wfh);
      if (!userWfh.length)
        return message.reply(this.messHelpTime).catch(console.error);

      const pad =
        userWfh.reduce((a, b) => (a < b.email.length ? b.email.length : a), 0) +
        2;
      userWfh.unshift({
        email: "[email]",
        str_spent_time: "[spent]",
        str_call_time: "[call]",
        str_active_time: "[active]",
      });
      const messRep = userWfh
        .map(
          (e) =>
            `${e.email.padEnd(pad)} ${e.str_spent_time.padEnd(
              10
            )} ${e.str_call_time.padEnd(10)} ${e.str_active_time.padEnd(10)}`
        )
        .join("\n");
      const Embed = new EmbedBuilder()
        .setTitle(
          `Danh sách tracker ngày hôm nay tổng là ${userWfh.length} người`
        )
        .setColor("Green")
        .setDescription("```" + `${messRep}` + "```");
      await message.reply({ embeds: [Embed] }).catch(console.error);
    } catch (error) {
      console.log(error);
    }

    // let authorId = message.author.id;

    // let awc = new AWClient("komubot-client", {
    //   baseURL: "http://tracker.komu.vn:5600",
    //   testing: false,
    // });
    // if (!args[0] || !args[1])
    //   return message
    //     .reply({
    //       content: this.messTrackerHelp,
    //       // ephemeral: true
    //     })
    //     .catch((err) => {
    //       this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //     });
    // let hours = Math.floor(3600 * 7);
    // if (args[1] === "daily") {
    //   let currentDate = new Date();
    //   let timezone = currentDate.getTimezoneOffset() / -60;
    //   let startTime = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     currentDate.getDate() - 2,
    //     17 + timezone,
    //     0,
    //     0
    //   );
    //   let endTime = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     currentDate.getDate() - 1,
    //     17 + timezone,
    //     0,
    //     0
    //   );
    //   currentDate.setDate(currentDate.getDate() - 1);
    //   let date = new Date(currentDate).toLocaleDateString("en-US", {
    //     year: "numeric",
    //     month: "2-digit",
    //     day: "2-digit",
    //   });

    //   if (args[2]) {
    //     let email = args[2] || "";
    //     if (!email) {
    //       const user = await this.userRepository.findOne({
    //         where: { userId: message.author.id },
    //       });
    //       email = user.email;
    //     }

    //     const arrayUser = await this.trackerSpentTimeRepository
    //       .createQueryBuilder("users")
    //       .select("email")
    //       .addSelect('MAX("spent_time")', "timeStamp")
    //       .addSelect('MAX("call_time")', "timeStamp")
    //       .where('"email" = :email', {
    //         email: email,
    //       })
    //       .andWhere(`"date" = :date`, {
    //         date: date,
    //       })
    //       .groupBy("email")
    //       .execute();

    //     if (arrayUser.length > 0) {
    //       const userTracker = await this.trackerSpentTimeRepository
    //         .createQueryBuilder("users")
    //         .where('"spent_time" IN (:...time_stamps)', {
    //           time_stamps: arrayUser.map((item) => item.timeStamp),
    //         })
    //         .select("users.*")
    //         .execute();

    //       userTracker.sort(
    //         (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
    //       );

    //       try {
    //         const events = await awc.query(
    //           [{ start: startTime, end: endTime }],
    //           await this.queryTracker(email)
    //         );

    //         const spent_time = events.reduce(
    //           (res, event) => res + event.window.duration,
    //           0
    //         );

    //         if (userTracker.length > 0) {
    //           userTracker.map(async (check) => {
    //             const Embed = new EmbedBuilder()
    //               .setTitle(`Số giờ sử dụng tracker của ${email} hôm qua`)
    //               .setColor("Red")
    //               .setDescription(
    //                 `${this.showTrackerTime(
    //                   spent_time
    //                 )}, call time: ${this.showTrackerTime(
    //                   check.call_time || 0
    //                 )}`
    //               );
    //             await message.reply({ embeds: [Embed] }).catch((err) => {
    //               this.komubotrestService.sendErrorToDevTest(
    //                 client,
    //                 authorId,
    //                 err
    //               );
    //             });
    //           });
    //         } else {
    //           const Embed = new EmbedBuilder()
    //             .setTitle(`Số giờ sử dụng tracker của ${email} hôm qua`)
    //             .setColor("Red")
    //             .setDescription(`${this.showTrackerTime(spent_time)}`);
    //           await message.reply({ embeds: [Embed] }).catch((err) => {
    //             this.komubotrestService.sendErrorToDevTest(
    //               client,
    //               authorId,
    //               err
    //             );
    //           });
    //         }
    //       } catch (error) {
    //         const Embed = new EmbedBuilder()
    //           .setTitle(`Số giờ sử dụng tracker của ${email} hôm qua`)
    //           .setColor("Red")
    //           .setDescription(this.messHelpDaily);
    //         return message.reply({ embeds: [Embed] }).catch((err) => {
    //           this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //         });
    //       }
    //     }
    //   } else {
    //     let listUser = [];
    //     const userWFH = await this.getUserWFH(date, message, args, client);
    //     if (!userWFH) {
    //       let messWFH = "```" + "Không có ai đăng kí WFH trong ngày" + "```";
    //       return message.reply(messWFH).catch((err) => {
    //         this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //       });
    //     }

    //     await Promise.all(
    //       userWFH.map(async (item) => {
    //         const arrayUser = await this.trackerSpentTimeRepository
    //           .createQueryBuilder("users")
    //           .select("email")
    //           .addSelect('MAX("spent_time")', "timeStamp")
    //           .addSelect('MAX("call_time")', "timeStamp")
    //           .where('"email" = :email', {
    //             email: item,
    //           })
    //           .andWhere("spent_time <= :ltespent_time", {
    //             ltespent_time: hours,
    //           })
    //           .andWhere(`"date" = :date`, {
    //             date: date,
    //           })
    //           .groupBy("email")
    //           .execute();

    //         if (arrayUser.length > 0) {
    //           const userTracker = await this.trackerSpentTimeRepository
    //             .createQueryBuilder("users")
    //             .where('"spent_time" IN (:...time_stamps)', {
    //               time_stamps: arrayUser.map((item) => item.timeStamp),
    //             })
    //             .select("users.*")
    //             .execute();

    //           userTracker.sort(
    //             (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
    //           );

    //           try {
    //             const events = await awc.query(
    //               [{ start: startTime, end: endTime }],
    //               await this.queryTracker(item)
    //             );

    //             const spent_time = events.reduce(
    //               (res, event) => res + event.window.duration,
    //               0
    //             );

    //             userTracker.map(async (check) => {
    //               if (spent_time < hours) {
    //                 listUser.push({
    //                   email: item,
    //                   spent_time: this.showTrackerTime(spent_time),
    //                   call_time: this.showTrackerTime(check.call_time || 0),
    //                 });
    //               }
    //             });
    //           } catch (error) {
    //             console.error;
    //           }
    //         }
    //       })
    //     );

    //     let mess;
    //     if (!listUser) {
    //       return;
    //     } else if (Array.isArray(listUser) && listUser.length === 0) {
    //       mess = "```" + "Không có ai vi phạm trong ngày" + "```";
    //       return message.reply(mess).catch((err) => {
    //         this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //       });
    //     } else {
    //       for (let i = 0; i <= Math.ceil(listUser.length / 50); i += 1) {
    //         if (listUser.slice(i * 50, (i + 1) * 50).length === 0) break;
    //         mess = listUser
    //           .slice(i * 50, (i + 1) * 50)
    //           .map(
    //             (list) =>
    //               `${list.email}:
    //             ${list.spent_time}, call time: ${list.call_time || 0}`
    //           )
    //           .join("\n");
    //         const Embed = new EmbedBuilder()
    //           .setTitle(
    //             `Những người không bật đủ thời gian tracker trong ngày hôm qua`
    //           )
    //           .setColor("Red")
    //           .setDescription(`${mess}`);
    //         return message.reply({ embeds: [Embed] }).catch((err) => {
    //           this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //         });
    //       }
    //     }
    //   }
    // } else if (args[1] === "weekly") {
    //   let dateMondayToSFriday = [];
    //   const current = new Date();
    //   const first = current.getDate() - current.getDay();
    //   const firstday = new Date(current.setDate(first + 1)).toString();
    //   for (let i = 1; i < 6; i++) {
    //     const next = new Date(current.getTime());
    //     next.setDate(first + i);
    //     const date = new Date(next).toLocaleDateString("en-US", {
    //       year: "numeric",
    //       month: "2-digit",
    //       day: "2-digit",
    //     });
    //     dateMondayToSFriday.push(date);
    //   }
    //   if (args[2]) {
    //     let email = args[2] || "";
    //     if (!email) {
    //       const user = await this.userRepository.findOne({
    //         where: { userId: message.author.id },
    //       });
    //       email = user.email;
    //     }

    //     for (const itemDay of dateMondayToSFriday) {
    //       const month = itemDay.slice(0, 2);
    //       const day = itemDay.slice(3, 5);
    //       const year = itemDay.slice(6);

    //       const fomat = `${day}/${month}/${year}`;
    //       const currentDate = new Date(itemDay);
    //       const timezone = currentDate.getTimezoneOffset() / -60;
    //       const startTime = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate()
    //       );
    //       const endTime = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate() + 1
    //       );

    //       const arrayUser = await this.trackerSpentTimeRepository
    //         .createQueryBuilder("users")
    //         .select("email")
    //         .addSelect('MAX("spent_time")', "timeStamp")
    //         .addSelect('MAX("call_time")', "timeStamp")
    //         .where('"email" = :email', {
    //           email: email,
    //         })
    //         .andWhere("spent_time <= :ltespent_time", {
    //           ltespent_time: hours,
    //         })
    //         .andWhere(`"date" = :date`, {
    //           date: itemDay,
    //         })
    //         .andWhere(`"wfh" = :wfh`, {
    //           wfh: true,
    //         })
    //         .groupBy("email")
    //         .execute();

    //       if (arrayUser.length > 0) {
    //         const userTracker = await this.trackerSpentTimeRepository
    //           .createQueryBuilder("users")
    //           .where('"spent_time" IN (:...time_stamps)', {
    //             time_stamps: arrayUser.map((item) => item.timeStamp),
    //           })
    //           .select("users.*")
    //           .execute();

    //         userTracker.sort(
    //           (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
    //         );

    //         try {
    //           const events = await awc.query(
    //             [{ start: startTime, end: endTime }],
    //             await this.queryTracker(email)
    //           );

    //           const spent_time = events.reduce(
    //             (res, event) => res + event.window.duration,
    //             0
    //           );

    //           if (userTracker.length > 0) {
    //             userTracker.map(async (check) => {
    //               const Embed = new EmbedBuilder()
    //                 .setTitle(
    //                   `Số giờ sử dụng tracker của ${email} ngày ${fomat}`
    //                 )
    //                 .setColor("Red")
    //                 .setDescription(
    //                   `${this.showTrackerTime(
    //                     spent_time
    //                   )}, call time: ${this.showTrackerTime(
    //                     check.call_time || 0
    //                   )}`
    //                 );
    //               await message.reply({ embeds: [Embed] }).catch((err) => {
    //                 this.komubotrestService.sendErrorToDevTest(
    //                   client,
    //                   authorId,
    //                   err
    //                 );
    //               });
    //             });
    //           } else {
    //             const Embed = new EmbedBuilder()
    //               .setTitle(`Số giờ sử dụng tracker của ${email} ngày ${fomat}`)
    //               .setColor("Red")
    //               .setDescription(`${this.showTrackerTime(spent_time)}`);
    //             await message.reply({ embeds: [Embed] }).catch((err) => {
    //               this.komubotrestService.sendErrorToDevTest(
    //                 client,
    //                 authorId,
    //                 err
    //               );
    //             });
    //           }
    //         } catch (error) {
    //           const Embed = new EmbedBuilder()
    //             .setTitle(`Số giờ sử dụng tracker của ${email} ngày ${fomat}`)
    //             .setColor("Red")
    //             .setDescription(this.messHelpWeekly);
    //           await message.reply({ embeds: [Embed] }).catch((err) => {
    //             this.komubotrestService.sendErrorToDevTest(
    //               client,
    //               authorId,
    //               err
    //             );
    //           });
    //         }
    //       }
    //     }
    //   } else {
    //     for (const itemDay of dateMondayToSFriday) {
    //       const month = itemDay.slice(0, 2);
    //       const day = itemDay.slice(3, 5);
    //       const year = itemDay.slice(6);

    //       const fomat = `${day}/${month}/${year}`;
    //       const currentDate = new Date(itemDay);
    //       const timezone = currentDate.getTimezoneOffset() / -60;
    //       const startTime = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate()
    //       );
    //       const endTime = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate() + 1
    //       );

    //       let listUser = [];
    //       const userWFH = await this.getUserWFH(itemDay, message, args, client);
    //       if (!userWFH) {
    //         let messWFH = "```" + "Không có ai đăng kí WFH trong ngày" + "```";
    //         return message.reply(messWFH).catch((err) => {
    //           this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //         });
    //       }

    //       await Promise.all(
    //         userWFH.map(async (item) => {
    //           const arrayUser = await this.trackerSpentTimeRepository
    //             .createQueryBuilder("users")
    //             .select("email")
    //             .addSelect('MAX("spent_time")', "timeStamp")
    //             .addSelect('MAX("call_time")', "timeStamp")
    //             .where('"email" = :email', {
    //               email: item,
    //             })
    //             .andWhere("spent_time <= :ltespent_time", {
    //               ltespent_time: hours,
    //             })
    //             .andWhere(`"date" = :date`, {
    //               date: itemDay,
    //             })
    //             .groupBy("email")
    //             .execute();

    //           if (arrayUser.length > 0) {
    //             const userTracker = await this.trackerSpentTimeRepository
    //               .createQueryBuilder("users")
    //               .where('"spent_time" IN (:...time_stamps)', {
    //                 time_stamps: arrayUser.map((item) => item.timeStamp),
    //               })
    //               .select("users.*")
    //               .execute();

    //             userTracker.sort(
    //               (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
    //             );

    //             try {
    //               const events = await awc.query(
    //                 [{ start: startTime, end: endTime }],
    //                 await this.queryTracker(item)
    //               );

    //               const spent_time = events.reduce(
    //                 (res, event) => res + event.window.duration,
    //                 0
    //               );

    //               userTracker.map(async (check) => {
    //                 if (spent_time < hours) {
    //                   listUser.push({
    //                     email: item,
    //                     spent_time: this.showTrackerTime(spent_time),
    //                     call_time: this.showTrackerTime(check.call_time || 0),
    //                   });
    //                 }
    //               });
    //             } catch (error) {
    //               console.error;
    //             }
    //           }
    //         })
    //       );

    //       let mess;
    //       if (!listUser) {
    //         return;
    //       } else if (Array.isArray(listUser) && listUser.length === 0) {
    //         mess = "```" + `Không có ai vi phạm trong ngày ${fomat}` + "```";
    //         await message.reply(mess).catch((err) => {
    //           this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //         });
    //       } else {
    //         for (let i = 0; i <= Math.ceil(listUser.length / 50); i += 1) {
    //           if (listUser.slice(i * 50, (i + 1) * 50).length === 0) break;
    //           let dataTracker = listUser;
    //           mess = dataTracker
    //             .slice(i * 50, (i + 1) * 50)
    //             .map(
    //               (list) =>
    //                 `${list.email}:
    //             ${list.spent_time}, call time: ${list.call_time || 0}`
    //             )
    //             .join("\n");

    //           const Embed = new EmbedBuilder()
    //             .setTitle(
    //               `Những người không bật đủ thời gian tracker trong ngày ${itemDay}`
    //             )
    //             .setColor("Red")
    //             .setDescription(`${mess}`);
    //           await message.reply({ embeds: [Embed] }).catch((err) => {
    //             this.komubotrestService.sendErrorToDevTest(
    //               client,
    //               authorId,
    //               err
    //             );
    //           });
    //         }
    //       }
    //     }
    //   }
    // } else if (args[1] === "time") {
    //   let email = args[2] || "";
    //   if (!email) {
    //     const user = await this.userRepository.findOne({
    //       where: { userId: message.author.id },
    //     });
    //     email = user.email;
    //   }

    //   const currentDate = new Date();
    //   const timezone = currentDate.getTimezoneOffset() / -60;
    //   const startTime = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     currentDate.getDate() - 1,
    //     17 + timezone,
    //     0,
    //     0
    //   );
    //   const endTime = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     currentDate.getDate(),
    //     17 + timezone,
    //     0,
    //     0
    //   );

    //   const date = new Date(currentDate).toLocaleDateString("en-US", {
    //     year: "numeric",
    //     month: "2-digit",
    //     day: "2-digit",
    //   });

    //   const arrayUser = await this.trackerSpentTimeRepository
    //     .createQueryBuilder("users")
    //     .select("email")
    //     .addSelect('MAX("spent_time")', "timeStamp")
    //     .addSelect('MAX("call_time")', "timeStamp")
    //     .where('"email" = :email', {
    //       email: email,
    //     })
    //     .andWhere(`"date" = :date`, {
    //       date: date,
    //     })
    //     .groupBy("email")
    //     .execute();

    //   if (arrayUser.length > 0) {
    //     const userTracker = await this.trackerSpentTimeRepository
    //       .createQueryBuilder("users")
    //       .where('"spent_time" IN (:...time_stamps)', {
    //         time_stamps: arrayUser.map((item) => item.timeStamp),
    //       })
    //       .select("users.*")
    //       .execute();

    //     try {
    //       const events = await awc.query(
    //         [{ start: startTime, end: endTime }],
    //         await this.queryTracker(email)
    //       );

    //       const spent_time = events.reduce(
    //         (res, event) => res + event.window.duration,
    //         0
    //       );

    //       if (userTracker.length > 0) {
    //         userTracker.map(async (check) => {
    //           const Embed = new EmbedBuilder()
    //             .setTitle(`Số giờ sử dụng tracker của ${email} hôm nay`)
    //             .setColor("Red")
    //             .setDescription(
    //               `${this.showTrackerTime(
    //                 spent_time
    //               )}, call time: ${this.showTrackerTime(check.call_time || 0)}`
    //             );
    //           await message.reply({ embeds: [Embed] }).catch((err) => {
    //             this.komubotrestService.sendErrorToDevTest(
    //               client,
    //               authorId,
    //               err
    //             );
    //           });
    //         });
    //       } else {
    //         const Embed = new EmbedBuilder()
    //           .setTitle(`Số giờ sử dụng tracker của ${email} hôm nay`)
    //           .setColor("Red")
    //           .setDescription(`${this.showTrackerTime(spent_time)}`);
    //         await message.reply({ embeds: [Embed] }).catch((err) => {
    //           this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //         });
    //       }
    //     } catch (error) {
    //       const Embed = new EmbedBuilder()
    //         .setTitle(`Số giờ sử dụng tracker của ${email} hôm nay`)
    //         .setColor("Red")
    //         .setDescription(this.messHelpTime);
    //       return message.reply({ embeds: [Embed] }).catch((err) => {
    //         this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //       });
    //     }
    //   }
    // }
    // if (args[1] !== "daily" && args[1] !== "weekly" && args[1] !== "time") {
    //   if (
    //     !/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/.test(
    //       args[1]
    //     )
    //   ) {
    //     return message
    //       .reply({
    //         content: this.messTrackerHelp,
    //         // ephemeral: true
    //       })
    //       .catch((err) => {
    //         this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //       });
    //   }
    //   const month = args[1].slice(0, 2);
    //   const day = args[1].slice(3, 5);
    //   const year = args[1].slice(6);

    //   const format = `${day}/${month}/${year}`;

    //   const currentDate = new Date(format);
    //   const timezone = currentDate.getTimezoneOffset() / -60;
    //   let startTime = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     currentDate.getDate()
    //   );
    //   let endTime = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     currentDate.getDate() + 1
    //   );

    //   if (args[2]) {
    //     let email = args[2] || "";
    //     if (!email) {
    //       const user = await this.userRepository.findOne({
    //         where: { userId: message.author.id },
    //       });
    //       email = user.email;
    //     }

    //     const arrayUser = await this.trackerSpentTimeRepository
    //       .createQueryBuilder("users")
    //       .select("email")
    //       .addSelect('MAX("spent_time")', "timeStamp")
    //       .addSelect('MAX("call_time")', "timeStamp")
    //       .where('"email" = :email', {
    //         email: email,
    //       })
    //       .andWhere(`"date" = :date`, {
    //         date: format,
    //       })
    //       .groupBy("email")
    //       .execute();

    //     if (arrayUser.length > 0) {
    //       const userTracker = await this.trackerSpentTimeRepository
    //         .createQueryBuilder("users")
    //         .where('"spent_time" IN (:...time_stamps)', {
    //           time_stamps: arrayUser.map((item) => item.timeStamp),
    //         })
    //         .select("users.*")
    //         .execute();

    //       userTracker.sort(
    //         (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
    //       );

    //       try {
    //         const events = await awc.query(
    //           [{ start: startTime, end: endTime }],
    //           await this.queryTracker(email)
    //         );

    //         const spent_time = events.reduce(
    //           (res, event) => res + event.window.duration,
    //           0
    //         );

    //         if (userTracker.length > 0) {
    //           userTracker.map(async (check) => {
    //             const Embed = new EmbedBuilder()
    //               .setTitle(
    //                 `Số giờ sử dụng tracker của ${email} ngày ${args[1]}`
    //               )
    //               .setColor("Red")
    //               .setDescription(
    //                 `${this.showTrackerTime(
    //                   spent_time
    //                 )}, call time: ${this.showTrackerTime(
    //                   check.call_time || 0
    //                 )}`
    //               );
    //             await message.reply({ embeds: [Embed] }).catch((err) => {
    //               this.komubotrestService.sendErrorToDevTest(
    //                 client,
    //                 authorId,
    //                 err
    //               );
    //             });
    //           });
    //         } else {
    //           const Embed = new EmbedBuilder()
    //             .setTitle(`Số giờ sử dụng tracker của ${email} hôm nay`)
    //             .setColor("Red")
    //             .setDescription(`${this.showTrackerTime(spent_time)}`);
    //           await message.reply({ embeds: [Embed] }).catch((err) => {
    //             this.komubotrestService.sendErrorToDevTest(
    //               client,
    //               authorId,
    //               err
    //             );
    //           });
    //         }
    //       } catch (error) {
    //         const Embed = new EmbedBuilder()
    //           .setTitle(`Số giờ sử dụng tracker của ${email} ngày ${args[1]}`)
    //           .setColor("Red")
    //           .setDescription(this.messHelpDate);
    //         return message.reply({ embeds: [Embed] }).catch((err) => {
    //           this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //         });
    //       }
    //     }
    //   } else {
    //     let listUser = [];
    //     const userWFH = await this.getUserWFH(format, message, args, client);
    //     if (!userWFH) {
    //       let messWFH = "```" + "Không có ai đăng kí WFH trong ngày" + "```";
    //       return message.reply(messWFH).catch((err) => {
    //         this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //       });
    //     }

    //     await Promise.all(
    //       userWFH.map(async (item) => {
    //         const arrayUser = await this.trackerSpentTimeRepository
    //           .createQueryBuilder("users")
    //           .select("email")
    //           .addSelect('MAX("spent_time")', "timeStamp")
    //           .addSelect('MAX("call_time")', "timeStamp")
    //           .where('"email" = :email', {
    //             email: item,
    //           })
    //           .andWhere(`"date" = :date`, {
    //             date: format,
    //           })
    //           .groupBy("email")
    //           .execute();

    //         if (arrayUser.length > 0) {
    //           const userTracker = await this.trackerSpentTimeRepository
    //             .createQueryBuilder("users")
    //             .where('"spent_time" IN (:...time_stamps)', {
    //               time_stamps: arrayUser.map((item) => item.timeStamp),
    //             })
    //             .select("users.*")
    //             .execute();
    //           userTracker.sort(
    //             (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
    //           );

    //           try {
    //             const events = await awc.query(
    //               [{ start: startTime, end: endTime }],
    //               await this.queryTracker(item)
    //             );

    //             const spent_time = events.reduce(
    //               (res, event) => res + event.window.duration,
    //               0
    //             );

    //             userTracker.map(async (check) => {
    //               if (spent_time < hours) {
    //                 listUser.push({
    //                   email: item,
    //                   spent_time: this.showTrackerTime(spent_time),
    //                   call_time: this.showTrackerTime(check.call_time || 0),
    //                 });
    //               }
    //             });
    //           } catch (error) {
    //             console.error;
    //           }
    //         }
    //       })
    //     );

    //     let mess;
    //     if (!listUser) {
    //       return;
    //     } else if (Array.isArray(listUser) && listUser.length === 0) {
    //       mess = "```" + `Không có ai vi phạm trong ngày ${args[1]}` + "```";
    //       return message.reply(mess).catch((err) => {
    //         this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //       });
    //     } else {
    //       for (let i = 0; i <= Math.ceil(listUser.length / 50); i += 1) {
    //         if (listUser.slice(i * 50, (i + 1) * 50).length === 0) break;
    //         mess = listUser
    //           .slice(i * 50, (i + 1) * 50)
    //           .map(
    //             (list) =>
    //               `${list.email}:
    //             ${list.spent_time}, call time: ${list.call_time || 0}`
    //           )
    //           .join("\n");
    //         const Embed = new EmbedBuilder()
    //           .setTitle(
    //             `Những người không bật đủ thời gian tracker trong ngày ${args[1]}`
    //           )
    //           .setColor("Red")
    //           .setDescription(`${mess}`);
    //         return message.reply({ embeds: [Embed] }).catch((err) => {
    //           this.komubotrestService.sendErrorToDevTest(client, authorId, err);
    //         });
    //       }
    //     }
    //   }
    // }
  }
  // showTrackerTime(spentTime) {
  //   const duration = intervalToDuration({ start: 0, end: spentTime * 1000 });
  //   return `${duration.hours}h ${duration.minutes}m ${duration.seconds}s`;
  // }
}
