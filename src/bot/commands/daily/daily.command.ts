import { HttpService } from "@nestjs/axios";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, Message, TextChannel } from "discord.js";
import { firstValueFrom } from "rxjs";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { User } from "src/bot/models/user.entity";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { logTimeSheetFromDaily } from "src/bot/utils/timesheet.until";
import { UtilsService } from "src/bot/utils/utils.service";
import { Repository } from "typeorm";
import { DailyService } from "./daily.service";

const messHelp =
  "```" +
  "Please daily follow this template" +
  "\n" +
  "*daily [projectCode] [date]" +
  "\n" +
  "yesterday: what you have done yesterday" +
  "\n" +
  "today: what you're going to to today; 2h" +
  "\n" +
  "block: thing that block you " +
  "```";

const dailyHelp =
  "```" +
  "Daily meeting note, recap your daily work items and log timesheet automatically." +
  "\n" +
  "Please daily follow this template:" +
  "\n\n" +
  "*daily [projectCode] [date]" +
  "\n" +
  "- yesterday: what you have done yesterday" +
  "\n" +
  "- today: what you're going to to today; 2h" +
  "\n" +
  "- block: thing that block you" +
  "\n\n" +
  "Tips:" +
  "\n" +
  "- Today message will be log to timesheet automatically" +
  "\n" +
  "- Make sure that you checked the default task on timesheet tool" +
  "\n" +
  "- If no project code provided de default project will be used" +
  "\n" +
  "- Your projects can be listed by *userinfo or *timesheet help" +
  "\n" +
  "- Date accepting format dd/mm/yyy" +
  "\n" +
  "- If no time provided the timesheet will be created with 1h by default" +
  "\n" +
  "- Please review your timesheet to make sure that the information are correct" +
  "\n" +
  "- You can log multiple task for a project splitting by +" +
  "\n" +
  "- If you want to daily for multiple project please use *daily multiple times" +
  "```";

function setTime(date, hours, minute, second, msValue) {
  return date.setHours(hours, minute, second, msValue);
}

function checkTimeSheet() {
  let result = false;
  const time = new Date();
  const cur = new Date();
  const timezone = time.getTimezoneOffset() / -60;

  const fisrtTimeMorning = new Date(
    setTime(time, 0 + timezone, 30, 0, 0)
  ).getTime();
  const lastTimeMorning = new Date(
    setTime(time, 2 + timezone, 31, 0, 0)
  ).getTime();
  const fisrtTimeAfternoon = new Date(
    setTime(time, 5 + timezone, 0, 0, 0)
  ).getTime();
  const lastTimeAfternoon = new Date(
    setTime(time, 11 + timezone, 1, 0, 0)
  ).getTime();

  if (
    (cur.getTime() >= fisrtTimeMorning && cur.getTime() <= lastTimeMorning) ||
    (cur.getTime() >= fisrtTimeAfternoon && cur.getTime() <= lastTimeAfternoon)
  ) {
    result = true;
  }
  return result;
}

function checkTimeNotWFH() {
  let resultWfh = false;
  const time = new Date();
  const cur = new Date();
  const timezone = time.getTimezoneOffset() / -60;

  const fisrtTimeWFH = new Date(
    setTime(time, 0 + timezone, 30, 0, 0)
  ).getTime();
  const lastTimeWFH = new Date(setTime(time, 10 + timezone, 0, 0, 0)).getTime();

  if (cur.getTime() >= fisrtTimeWFH && cur.getTime() <= lastTimeWFH) {
    resultWfh = true;
  }
  return resultWfh;
}

@CommandLine({
  name: "daily",
  description: "daily work",
  cat: "komu",
})
export class DailyCommand implements CommandLineClass {
  constructor(
    private readonly dailyService: DailyService,
    private readonly utilsService: UtilsService,
    private komubotrestService: KomubotrestService,
    private readonly clientConfigService: ClientConfigService,
    private readonly http: HttpService,
    private configService: ClientConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async execute(message: Message, args, client: Client) {
    try {
      const authorId = message.author.id;
      let checkDaily = false;

      if (message.channel.isThread()) {
        checkDaily = await this.dailyService.handleThreadChannel(message);
      } else if (message.channel instanceof TextChannel) {
        checkDaily = await this.dailyService.handleTextChannel(message);
      } else {
        checkDaily = false;
      }

      if (checkDaily != true) {
        return message
          .reply({
            content: "can't daily in private channel",
            // ephemeral: true,
          })
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      } else {
        const findUser = await this.userRepository
          .createQueryBuilder()
          .where(`"userId" = :userId`, { userId: message.author.id })
          .andWhere(`"deactive" IS NOT true`)
          .select("*")
          .getRawOne();
        if (!findUser) return;
        const authorUsername = findUser.email;
        if (args[0] === "help") {
          return message
            .reply({
              content: dailyHelp,
              // ephemeral: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
        } else {
          const daily = args.join(" ");
          const content = message.content;
          let checkDaily = false;
          const wordInString = (s, word) =>
            new RegExp("\\b" + word + "\\b", "i").test(s);
          ["yesterday", "today", "block"].forEach((q) => {
            if (!wordInString(daily, q)) return (checkDaily = true);
          });
          const emailAddress = `${authorUsername}@ncc.asia`;

          if (checkDaily) {
            return message
              .reply({
                content: messHelp,
                // ephemeral: true,
              })
              .catch((err) => {
                this.komubotrestService.sendErrorToDevTest(
                  client,
                  authorId,
                  err
                );
              });
          }

          if (!daily || daily == undefined) {
            return message
              .reply({
                content: "```please add your daily text```",
                // ephemeral: true,
              })
              .catch((err) => {
                this.komubotrestService.sendErrorToDevTest(
                  client,
                  authorId,
                  err
                );
              });
          }

          if (daily.length < 100) {
            return message
              .reply({
                content:
                  "```Please enter at least 100 characters in your daily text```",
                // ephemeral: true,
              })
              .catch((err) => {
                this.komubotrestService.sendErrorToDevTest(
                  client,
                  authorId,
                  err
                );
              });
          }

          // if (findPeriod(daily)) {
          //   return message
          //     .reply({
          //       content: '```Please chat with correct syntax```',
          //       ephemeral: true,
          //     })
          //     .catch((err) => {
          //       this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          //     });
          // }

          const date = new Date();
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
                    securitycode: this.configService.wfhApiKey,
                  },
                })
                .pipe((res) => res)
            );
          } catch (error) {
            console.log(error);
          }

          const wfhUserEmail = wfhGetApi
            ? wfhGetApi.data.result.map((item) =>
                this.utilsService.getUserNameByEmail(item.emailAddress)
              )
            : [];

          if (wfhUserEmail.includes(authorUsername)) {
            await this.dailyService
              .saveDaily(message, args)
              .catch((err) => console.log(err));

            await logTimeSheetFromDaily({
              emailAddress,
              content: content,
            });

            if (!checkTimeSheet()) {
              message
                .reply({
                  content:
                    "```✅ Daily saved. (Invalid daily time frame. Please daily at 7h30-9h30, 12h-18h. WFH not daily 20k/time.)```",
                  // ephemeral: true,
                })
                .catch((err) => {
                  this.komubotrestService.sendErrorToDevTest(
                    client,
                    authorId,
                    err
                  );
                });
            } else {
              message
                .reply({
                  content: "✅ Daily saved.",
                  // ephemeral: true
                })
                .catch((err) => {
                  this.komubotrestService.sendErrorToDevTest(
                    client,
                    authorId,
                    err
                  );
                });
            }
          } else {
            await this.dailyService
              .saveDaily(message, args)
              .catch((err) => console.log(err));

            await logTimeSheetFromDaily({
              emailAddress,
              content: content,
            });

            if (!checkTimeNotWFH()) {
              message
                .reply({
                  content:
                    "```✅ Daily saved. (Invalid daily time frame. Please daily at 7h30-17h. not daily 20k/time.)```",
                  // ephemeral: true,
                })
                .catch((err) => {
                  this.komubotrestService.sendErrorToDevTest(
                    client,
                    authorId,
                    err
                  );
                });
            } else {
              message
                .reply({
                  content: "`✅` Daily saved.",
                  //  ephemeral: true
                })
                .catch((err) => {
                  this.komubotrestService.sendErrorToDevTest(
                    client,
                    authorId,
                    err
                  );
                });
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
