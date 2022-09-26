import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, EmbedBuilder } from "discord.js";
import { CheckCamera } from "src/bot/models/checkCamera.entity";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";
import { KomubotrestController } from "../komubotrest/komubotrest.controller";
import { UtilsService } from "../utils.service";
import { AWClient } from "aw-client";
import { intervalToDuration } from "date-fns";
import { TrackerSpentTime } from "src/bot/models/trackerSpentTime.entity";

@Injectable()
export class ReportTrackerService {
  constructor(
    @InjectRepository(User)
    private userReposistory: Repository<User>,
    @InjectRepository(TrackerSpentTime)
    private trackerSpentTimeReposistory: Repository<TrackerSpentTime>,
    private utilsService: UtilsService,
    private komubotrestController: KomubotrestController
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

  async getUserWFH(date, message, args, client) {
    let wfhGetApi;
    try {
      const url = date
        ? `${client.config.wfh.api_url}?date=${date}`
        : client.config.wfh.api_url;
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

  async queryTracker(email) {
    const query = [
      `events = flood(query_bucket("aw-watcher-window_${email}"));`,
      `not_afk = flood(query_bucket("aw-watcher-afk_${email}"));`,
      'not_afk = filter_keyvals(not_afk, "status", ["not-afk"]);',
      "browser_events = [];",
      'audible_events = filter_keyvals(browser_events, "audible", [true]);',
      "not_afk = period_union(not_afk, audible_events);",
      "events = filter_period_intersect(events, not_afk);",
      'events = categorize(events, [[["Work"],{"type":"regex","regex":"Google Docs|libreoffice|ReText|xlsx|docx|json|mstsc|Remote Desktop|Terminal"}],[["Work","Programming"],{"type":"regex","regex":"GitHub|Stack Overflow|BitBucket|Gitlab|vim|Spyder|kate|Ghidra|Scite|Jira|Visual Studio|Mongo|cmd"}],[["Work","Programming","IDEs"],{"type":"regex","regex":"deven|code|idea64","ignore_case":true}],[["Work","Programming","Others"],{"type":"regex","regex":"Bitbucket|gitlab|github|mintty|pgadmin","ignore_case":true}],[["Work","3D"],{"type":"regex","regex":"Blender"}],[["Media","Games"],{"type":"regex","regex":"Minecraft|RimWorld"}],[["Media","Video"],{"type":"regex","regex":"YouTube|Plex|VLC"}],[["Media","Social Media"],{"type":"regex","regex":"reddit|Facebook|Twitter|Instagram|devRant","ignore_case":true}],[["Media","Music"],{"type":"regex","regex":"Spotify|Deezer","ignore_case":true}],[["Comms","IM"],{"type":"regex","regex":"Messenger|Telegram|Signal|WhatsApp|Rambox|Slack|Riot|Discord|Nheko|Teams|Skype","ignore_case":true}],[["Comms","Email"],{"type":"regex","regex":"Gmail|Thunderbird|mutt|alpine"}]]);',
      'title_events = sort_by_duration(merge_events_by_keys(events, ["app", "title"]));',
      'app_events   = sort_by_duration(merge_events_by_keys(title_events, ["app"]));',
      'cat_events   = sort_by_duration(merge_events_by_keys(events, ["$category"]));',
      "app_events  = limit_events(app_events, 100);",
      "title_events  = limit_events(title_events, 100);",
      "duration = sum_durations(events);",
      "browser_events = split_url_events(browser_events);",
      'browser_urls = merge_events_by_keys(browser_events, ["url"]);',
      "browser_urls = sort_by_duration(browser_urls);",
      "browser_urls = limit_events(browser_urls, 100);",
      'browser_domains = merge_events_by_keys(browser_events, ["$domain"]);',
      "browser_domains = sort_by_duration(browser_domains);",
      "browser_domains = limit_events(browser_domains, 100);",
      "browser_duration = sum_durations(browser_events);",
      'RETURN = {\n        "window": {\n            "app_events": app_events,\n            "title_events": title_events,\n            "cat_events": cat_events,\n            "active_events": not_afk,\n            "duration": duration\n        },\n        "browser": {\n            "domains": browser_domains,\n            "urls": browser_urls,\n            "duration": browser_duration\n        }\n    };',
    ];
    return query;
  }

  async reportTracker(message, args, client) {
    let authorId = message.author.id;

    let awc = new AWClient("komubot-client", {
      baseURL: "http://tracker.komu.vn:5600",
      testing: false,
    });
    if (!args[0] || !args[1])
      return message
        .reply({ content: this.messTrackerHelp, ephemeral: true })
        .catch((err) => {
          this.komubotrestController.sendErrorToDevTest(client, authorId, err);
        });
    let hours = Math.floor(3600 * 7);
    if (args[1] === "daily") {
      let currentDate = new Date();
      let timezone = currentDate.getTimezoneOffset() / -60;
      let startTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 2,
        17 + timezone,
        0,
        0
      );
      let endTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 1,
        17 + timezone,
        0,
        0
      );
      currentDate.setDate(currentDate.getDate() - 1);
      let date = new Date(currentDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      if (args[2]) {
        let email = args[2] || "";
        if (!email) {
          const user = await this.userReposistory.findOne({
            where: { id: message.author.id },
          });
          email = user.email;
        }

        const arrayUser = await this.trackerSpentTimeReposistory
          .createQueryBuilder("users")
          .select("email")
          .addSelect('MAX("spent_time")', "timeStamp")
          .addSelect('MAX("call_time")', "timeStamp")
          .where('"email" = :email', {
            email: email,
          })
          .andWhere(`"date" = :date`, {
            date: date,
          })
          .groupBy("email")
          .execute();

        if (arrayUser.length > 0) {
          const userTracker = await this.trackerSpentTimeReposistory
            .createQueryBuilder("users")
            .where('"spent_time" IN (:...time_stamps)', {
              time_stamps: arrayUser.map((item) => item.timeStamp),
            })
            .select("users.*")
            .execute();

          userTracker.sort(
            (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
          );

          try {
            const events = await awc.query(
              [{ start: startTime, end: endTime }],
              await this.queryTracker(email)
            );

            const spent_time = events.reduce(
              (res, event) => res + event.window.duration,
              0
            );

            if (userTracker.length > 0) {
              userTracker.map(async (check) => {
                const Embed = new EmbedBuilder()
                  .setTitle(`Số giờ sử dụng tracker của ${email} hôm qua`)
                  .setColor("Red")
                  .setDescription(
                    `${this.showTrackerTime(
                      spent_time
                    )}, call time: ${this.showTrackerTime(
                      check.call_time || 0
                    )}`
                  );
                await message.reply({ embeds: [Embed] }).catch((err) => {
                  this.komubotrestController.sendErrorToDevTest(
                    client,
                    authorId,
                    err
                  );
                });
              });
            } else {
              const Embed = new EmbedBuilder()
                .setTitle(`Số giờ sử dụng tracker của ${email} hôm qua`)
                .setColor("Red")
                .setDescription(`${this.showTrackerTime(spent_time)}`);
              await message.reply({ embeds: [Embed] }).catch((err) => {
                this.komubotrestController.sendErrorToDevTest(
                  client,
                  authorId,
                  err
                );
              });
            }
          } catch (error) {
            const Embed = new EmbedBuilder()
              .setTitle(`Số giờ sử dụng tracker của ${email} hôm qua`)
              .setColor("Red")
              .setDescription(this.messHelpDaily);
            return message.reply({ embeds: [Embed] }).catch((err) => {
              this.komubotrestController.sendErrorToDevTest(
                client,
                authorId,
                err
              );
            });
          }
        }
      } else {
        let listUser = [];
        const userWFH = await this.getUserWFH(date, message, args, client);
        if (!userWFH) {
          let messWFH = "```" + "Không có ai đăng kí WFH trong ngày" + "```";
          return message.reply(messWFH).catch((err) => {
            this.komubotrestController.sendErrorToDevTest(
              client,
              authorId,
              err
            );
          });
        }

        await Promise.all(
          userWFH.map(async (item) => {
            const arrayUser = await this.trackerSpentTimeReposistory
              .createQueryBuilder("users")
              .select("email")
              .addSelect('MAX("spent_time")', "timeStamp")
              .addSelect('MAX("call_time")', "timeStamp")
              .where('"email" = :email', {
                email: item,
              })
              .andWhere("spent_time <= :ltespent_time", {
                ltespent_time: hours,
              })
              .andWhere(`"date" = :date`, {
                date: date,
              })
              .groupBy("email")
              .execute();

            if (arrayUser.length > 0) {
              const userTracker = await this.trackerSpentTimeReposistory
                .createQueryBuilder("users")
                .where('"spent_time" IN (:...time_stamps)', {
                  time_stamps: arrayUser.map((item) => item.timeStamp),
                })
                .select("users.*")
                .execute();

              userTracker.sort(
                (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
              );

              try {
                const events = await awc.query(
                  [{ start: startTime, end: endTime }],
                  await this.queryTracker(item)
                );

                const spent_time = events.reduce(
                  (res, event) => res + event.window.duration,
                  0
                );

                userTracker.map(async (check) => {
                  if (spent_time < hours) {
                    listUser.push({
                      email: item,
                      spent_time: this.showTrackerTime(spent_time),
                      call_time: this.showTrackerTime(check.call_time || 0),
                    });
                  }
                });
              } catch (error) {
                console.error;
              }
            }
          })
        );

        let mess;
        if (!listUser) {
          return;
        } else if (Array.isArray(listUser) && listUser.length === 0) {
          mess = "```" + "Không có ai vi phạm trong ngày" + "```";
          return message.reply(mess).catch((err) => {
            this.komubotrestController.sendErrorToDevTest(
              client,
              authorId,
              err
            );
          });
        } else {
          for (let i = 0; i <= Math.ceil(listUser.length / 50); i += 1) {
            if (listUser.slice(i * 50, (i + 1) * 50).length === 0) break;
            mess = listUser
              .slice(i * 50, (i + 1) * 50)
              .map(
                (list) =>
                  `${list.email}:
                ${list.spent_time}, call time: ${list.call_time || 0}`
              )
              .join("\n");
            const Embed = new EmbedBuilder()
              .setTitle(
                `Những người không bật đủ thời gian tracker trong ngày hôm qua`
              )
              .setColor("Red")
              .setDescription(`${mess}`);
            return message.reply({ embeds: [Embed] }).catch((err) => {
              this.komubotrestController.sendErrorToDevTest(
                client,
                authorId,
                err
              );
            });
          }
        }
      }
    } else if (args[1] === "weekly") {
      let dateMondayToSFriday = [];
      const current = new Date();
      const first = current.getDate() - current.getDay();
      const firstday = new Date(current.setDate(first + 1)).toString();
      for (let i = 1; i < 6; i++) {
        const next = new Date(current.getTime());
        next.setDate(first + i);
        const date = new Date(next).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        dateMondayToSFriday.push(date);
      }
      if (args[2]) {
        let email = args[2] || "";
        if (!email) {
          const user = await this.userReposistory.findOne({
            where: { id: message.author.id },
          });
          email = user.email;
        }

        for (const itemDay of dateMondayToSFriday) {
          const month = itemDay.slice(0, 2);
          const day = itemDay.slice(3, 5);
          const year = itemDay.slice(6);

          const fomat = `${day}/${month}/${year}`;
          const currentDate = new Date(itemDay);
          const timezone = currentDate.getTimezoneOffset() / -60;
          const startTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          );
          const endTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
          );

          const arrayUser = await this.trackerSpentTimeReposistory
            .createQueryBuilder("users")
            .select("email")
            .addSelect('MAX("spent_time")', "timeStamp")
            .addSelect('MAX("call_time")', "timeStamp")
            .where('"email" = :email', {
              email: email,
            })
            .andWhere("spent_time <= :ltespent_time", {
              ltespent_time: hours,
            })
            .andWhere(`"date" = :date`, {
              date: itemDay,
            })
            .andWhere(`"wfh" = :wfh`, {
              wfh: true,
            })
            .groupBy("email")
            .execute();

          if (arrayUser.length > 0) {
            const userTracker = await this.trackerSpentTimeReposistory
              .createQueryBuilder("users")
              .where('"spent_time" IN (:...time_stamps)', {
                time_stamps: arrayUser.map((item) => item.timeStamp),
              })
              .select("users.*")
              .execute();

            userTracker.sort(
              (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
            );

            try {
              const events = await awc.query(
                [{ start: startTime, end: endTime }],
                await this.queryTracker(email)
              );

              const spent_time = events.reduce(
                (res, event) => res + event.window.duration,
                0
              );

              if (userTracker.length > 0) {
                userTracker.map(async (check) => {
                  const Embed = new EmbedBuilder()
                    .setTitle(
                      `Số giờ sử dụng tracker của ${email} ngày ${fomat}`
                    )
                    .setColor("Red")
                    .setDescription(
                      `${this.showTrackerTime(
                        spent_time
                      )}, call time: ${this.showTrackerTime(
                        check.call_time || 0
                      )}`
                    );
                  await message.reply({ embeds: [Embed] }).catch((err) => {
                    this.komubotrestController.sendErrorToDevTest(
                      client,
                      authorId,
                      err
                    );
                  });
                });
              } else {
                const Embed = new EmbedBuilder()
                  .setTitle(`Số giờ sử dụng tracker của ${email} ngày ${fomat}`)
                  .setColor("Red")
                  .setDescription(`${this.showTrackerTime(spent_time)}`);
                await message.reply({ embeds: [Embed] }).catch((err) => {
                  this.komubotrestController.sendErrorToDevTest(
                    client,
                    authorId,
                    err
                  );
                });
              }
            } catch (error) {
              const Embed = new EmbedBuilder()
                .setTitle(`Số giờ sử dụng tracker của ${email} ngày ${fomat}`)
                .setColor("Red")
                .setDescription(this.messHelpWeekly);
              await message.reply({ embeds: [Embed] }).catch((err) => {
                this.komubotrestController.sendErrorToDevTest(
                  client,
                  authorId,
                  err
                );
              });
            }
          }
        }
      } else {
        for (const itemDay of dateMondayToSFriday) {
          const month = itemDay.slice(0, 2);
          const day = itemDay.slice(3, 5);
          const year = itemDay.slice(6);

          const fomat = `${day}/${month}/${year}`;
          const currentDate = new Date(itemDay);
          const timezone = currentDate.getTimezoneOffset() / -60;
          const startTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          );
          const endTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
          );

          let listUser = [];
          const userWFH = await this.getUserWFH(itemDay, message, args, client);
          if (!userWFH) {
            let messWFH = "```" + "Không có ai đăng kí WFH trong ngày" + "```";
            return message.reply(messWFH).catch((err) => {
              this.komubotrestController.sendErrorToDevTest(
                client,
                authorId,
                err
              );
            });
          }

          await Promise.all(
            userWFH.map(async (item) => {
              const arrayUser = await this.trackerSpentTimeReposistory
                .createQueryBuilder("users")
                .select("email")
                .addSelect('MAX("spent_time")', "timeStamp")
                .addSelect('MAX("call_time")', "timeStamp")
                .where('"email" = :email', {
                  email: item,
                })
                .andWhere("spent_time <= :ltespent_time", {
                  ltespent_time: hours,
                })
                .andWhere(`"date" = :date`, {
                  date: itemDay,
                })
                .groupBy("email")
                .execute();

              if (arrayUser.length > 0) {
                const userTracker = await this.trackerSpentTimeReposistory
                  .createQueryBuilder("users")
                  .where('"spent_time" IN (:...time_stamps)', {
                    time_stamps: arrayUser.map((item) => item.timeStamp),
                  })
                  .select("users.*")
                  .execute();

                userTracker.sort(
                  (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
                );

                try {
                  const events = await awc.query(
                    [{ start: startTime, end: endTime }],
                    await this.queryTracker(item)
                  );

                  const spent_time = events.reduce(
                    (res, event) => res + event.window.duration,
                    0
                  );

                  userTracker.map(async (check) => {
                    if (spent_time < hours) {
                      listUser.push({
                        email: item,
                        spent_time: this.showTrackerTime(spent_time),
                        call_time: this.showTrackerTime(check.call_time || 0),
                      });
                    }
                  });
                } catch (error) {
                  console.error;
                }
              }
            })
          );

          let mess;
          if (!listUser) {
            return;
          } else if (Array.isArray(listUser) && listUser.length === 0) {
            mess = "```" + `Không có ai vi phạm trong ngày ${fomat}` + "```";
            await message.reply(mess).catch((err) => {
              this.komubotrestController.sendErrorToDevTest(
                client,
                authorId,
                err
              );
            });
          } else {
            for (let i = 0; i <= Math.ceil(listUser.length / 50); i += 1) {
              if (listUser.slice(i * 50, (i + 1) * 50).length === 0) break;
              let dataTracker = listUser;
              mess = dataTracker
                .slice(i * 50, (i + 1) * 50)
                .map(
                  (list) =>
                    `${list.email}:
                ${list.spent_time}, call time: ${list.call_time || 0}`
                )
                .join("\n");

              const Embed = new EmbedBuilder()
                .setTitle(
                  `Những người không bật đủ thời gian tracker trong ngày ${itemDay}`
                )
                .setColor("Red")
                .setDescription(`${mess}`);
              await message.reply({ embeds: [Embed] }).catch((err) => {
                this.komubotrestController.sendErrorToDevTest(
                  client,
                  authorId,
                  err
                );
              });
            }
          }
        }
      }
    } else if (args[1] === "time") {
      let email = args[2] || "";
      if (!email) {
        const user = await this.userReposistory.findOne({
          where: { id: message.author.id },
        });
        email = user.email;
      }

      const currentDate = new Date();
      const timezone = currentDate.getTimezoneOffset() / -60;
      const startTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 1,
        17 + timezone,
        0,
        0
      );
      const endTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        17 + timezone,
        0,
        0
      );

      const date = new Date(currentDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const arrayUser = await this.trackerSpentTimeReposistory
        .createQueryBuilder("users")
        .select("email")
        .addSelect('MAX("spent_time")', "timeStamp")
        .addSelect('MAX("call_time")', "timeStamp")
        .where('"email" = :email', {
          email: email,
        })
        .andWhere(`"date" = :date`, {
          date: date,
        })
        .groupBy("email")
        .execute();

      if (arrayUser.length > 0) {
        const userTracker = await this.trackerSpentTimeReposistory
          .createQueryBuilder("users")
          .where('"spent_time" IN (:...time_stamps)', {
            time_stamps: arrayUser.map((item) => item.timeStamp),
          })
          .select("users.*")
          .execute();

        try {
          const events = await awc.query(
            [{ start: startTime, end: endTime }],
            await this.queryTracker(email)
          );

          const spent_time = events.reduce(
            (res, event) => res + event.window.duration,
            0
          );

          if (userTracker.length > 0) {
            userTracker.map(async (check) => {
              const Embed = new EmbedBuilder()
                .setTitle(`Số giờ sử dụng tracker của ${email} hôm nay`)
                .setColor("Red")
                .setDescription(
                  `${this.showTrackerTime(
                    spent_time
                  )}, call time: ${this.showTrackerTime(check.call_time || 0)}`
                );
              await message.reply({ embeds: [Embed] }).catch((err) => {
                this.komubotrestController.sendErrorToDevTest(
                  client,
                  authorId,
                  err
                );
              });
            });
          } else {
            const Embed = new EmbedBuilder()
              .setTitle(`Số giờ sử dụng tracker của ${email} hôm nay`)
              .setColor("Red")
              .setDescription(`${this.showTrackerTime(spent_time)}`);
            await message.reply({ embeds: [Embed] }).catch((err) => {
              this.komubotrestController.sendErrorToDevTest(
                client,
                authorId,
                err
              );
            });
          }
        } catch (error) {
          const Embed = new EmbedBuilder()
            .setTitle(`Số giờ sử dụng tracker của ${email} hôm nay`)
            .setColor("Red")
            .setDescription(this.messHelpTime);
          return message.reply({ embeds: [Embed] }).catch((err) => {
            this.komubotrestController.sendErrorToDevTest(
              client,
              authorId,
              err
            );
          });
        }
      }
    }
    if (args[1] !== "daily" && args[1] !== "weekly" && args[1] !== "time") {
      if (
        !/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/.test(
          args[1]
        )
      ) {
        return message
          .reply({ content: this.messTrackerHelp, ephemeral: true })
          .catch((err) => {
            this.komubotrestController.sendErrorToDevTest(
              client,
              authorId,
              err
            );
          });
      }
      const month = args[1].slice(0, 2);
      const day = args[1].slice(3, 5);
      const year = args[1].slice(6);

      const format = `${day}/${month}/${year}`;

      const currentDate = new Date(format);
      const timezone = currentDate.getTimezoneOffset() / -60;
      let startTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      let endTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );

      if (args[2]) {
        let email = args[2] || "";
        if (!email) {
          const user = await this.userReposistory.findOne({
            where: { id: message.author.id },
          });
          email = user.email;
        }

        const arrayUser = await this.trackerSpentTimeReposistory
          .createQueryBuilder("users")
          .select("email")
          .addSelect('MAX("spent_time")', "timeStamp")
          .addSelect('MAX("call_time")', "timeStamp")
          .where('"email" = :email', {
            email: email,
          })
          .andWhere(`"date" = :date`, {
            date: format,
          })
          .groupBy("email")
          .execute();

        if (arrayUser.length > 0) {
          const userTracker = await this.trackerSpentTimeReposistory
            .createQueryBuilder("users")
            .where('"spent_time" IN (:...time_stamps)', {
              time_stamps: arrayUser.map((item) => item.timeStamp),
            })
            .select("users.*")
            .execute();

          userTracker.sort(
            (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
          );

          try {
            const events = await awc.query(
              [{ start: startTime, end: endTime }],
              await this.queryTracker(email)
            );

            const spent_time = events.reduce(
              (res, event) => res + event.window.duration,
              0
            );

            if (userTracker.length > 0) {
              userTracker.map(async (check) => {
                const Embed = new EmbedBuilder()
                  .setTitle(
                    `Số giờ sử dụng tracker của ${email} ngày ${args[1]}`
                  )
                  .setColor("Red")
                  .setDescription(
                    `${this.showTrackerTime(
                      spent_time
                    )}, call time: ${this.showTrackerTime(
                      check.call_time || 0
                    )}`
                  );
                await message.reply({ embeds: [Embed] }).catch((err) => {
                  this.komubotrestController.sendErrorToDevTest(
                    client,
                    authorId,
                    err
                  );
                });
              });
            } else {
              const Embed = new EmbedBuilder()
                .setTitle(`Số giờ sử dụng tracker của ${email} hôm nay`)
                .setColor("Red")
                .setDescription(`${this.showTrackerTime(spent_time)}`);
              await message.reply({ embeds: [Embed] }).catch((err) => {
                this.komubotrestController.sendErrorToDevTest(
                  client,
                  authorId,
                  err
                );
              });
            }
          } catch (error) {
            const Embed = new EmbedBuilder()
              .setTitle(`Số giờ sử dụng tracker của ${email} ngày ${args[1]}`)
              .setColor("Red")
              .setDescription(this.messHelpDate);
            return message.reply({ embeds: [Embed] }).catch((err) => {
              this.komubotrestController.sendErrorToDevTest(
                client,
                authorId,
                err
              );
            });
          }
        }
      } else {
        let listUser = [];
        const userWFH = await this.getUserWFH(format, message, args, client);
        if (!userWFH) {
          let messWFH = "```" + "Không có ai đăng kí WFH trong ngày" + "```";
          return message.reply(messWFH).catch((err) => {
            this.komubotrestController.sendErrorToDevTest(
              client,
              authorId,
              err
            );
          });
        }

        await Promise.all(
          userWFH.map(async (item) => {
            const arrayUser = await this.trackerSpentTimeReposistory
              .createQueryBuilder("users")
              .select("email")
              .addSelect('MAX("spent_time")', "timeStamp")
              .addSelect('MAX("call_time")', "timeStamp")
              .where('"email" = :email', {
                email: item,
              })
              .andWhere(`"date" = :date`, {
                date: format,
              })
              .groupBy("email")
              .execute();

            if (arrayUser.length > 0) {
              const userTracker = await this.trackerSpentTimeReposistory
                .createQueryBuilder("users")
                .where('"spent_time" IN (:...time_stamps)', {
                  time_stamps: arrayUser.map((item) => item.timeStamp),
                })
                .select("users.*")
                .execute();
              userTracker.sort(
                (a, b) => parseFloat(a.spent_time) - parseFloat(b.spent_time)
              );

              try {
                const events = await awc.query(
                  [{ start: startTime, end: endTime }],
                  await this.queryTracker(item)
                );

                const spent_time = events.reduce(
                  (res, event) => res + event.window.duration,
                  0
                );

                userTracker.map(async (check) => {
                  if (spent_time < hours) {
                    listUser.push({
                      email: item,
                      spent_time: this.showTrackerTime(spent_time),
                      call_time: this.showTrackerTime(check.call_time || 0),
                    });
                  }
                });
              } catch (error) {
                console.error;
              }
            }
          })
        );

        let mess;
        if (!listUser) {
          return;
        } else if (Array.isArray(listUser) && listUser.length === 0) {
          mess = "```" + `Không có ai vi phạm trong ngày ${args[1]}` + "```";
          return message.reply(mess).catch((err) => {
            this.komubotrestController.sendErrorToDevTest(
              client,
              authorId,
              err
            );
          });
        } else {
          for (let i = 0; i <= Math.ceil(listUser.length / 50); i += 1) {
            if (listUser.slice(i * 50, (i + 1) * 50).length === 0) break;
            mess = listUser
              .slice(i * 50, (i + 1) * 50)
              .map(
                (list) =>
                  `${list.email}:
                ${list.spent_time}, call time: ${list.call_time || 0}`
              )
              .join("\n");
            const Embed = new EmbedBuilder()
              .setTitle(
                `Những người không bật đủ thời gian tracker trong ngày ${args[1]}`
              )
              .setColor("Red")
              .setDescription(`${mess}`);
            return message.reply({ embeds: [Embed] }).catch((err) => {
              this.komubotrestController.sendErrorToDevTest(
                client,
                authorId,
                err
              );
            });
          }
        }
      }
    }
  }

  showTrackerTime(spentTime) {
    const duration = intervalToDuration({ start: 0, end: spentTime * 1000 });
    return `${duration.hours}h ${duration.minutes}m ${duration.seconds}s`;
  }
}
