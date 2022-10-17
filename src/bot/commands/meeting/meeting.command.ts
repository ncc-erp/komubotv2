import { Client, Message, VoiceChannel } from "discord.js";
import { CommandLine, CommandLineClass } from "../../base/command.base";
import { MeetingService } from "./meeting.service";
import { UtilsService } from "src/bot/utils/utils.service";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { InjectRepository } from "@nestjs/typeorm";
import { Meeting } from "src/bot/models/meeting.entity";
import { Repository } from "typeorm";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { ClientConfigService } from "src/bot/config/client-config.service";

const messHelp =
  "```" +
  "*meeting" +
  "\n" +
  "*meeting cancel" +
  "\n" +
  "*meeting now" +
  "\n" +
  "*meeting meet" +
  "\n" +
  "*meeting task dd/MM/YYYY HH:mm repeat timerepeat" +
  "\n" +
  "*meeting task dd/MM/YYYY HH:mm once" +
  "\n" +
  "*meeting task dd/MM/YYYY HH:mm daily" +
  "\n" +
  "*meeting task dd/MM/YYYY HH:mm weekly" +
  "```";
@CommandLine({
  name: "meeting",
  description: "Meeting",
  cat: "komu",
})
export class MeetingCommand implements CommandLineClass {
  constructor(
    private meetingService: MeetingService,
    private readonly utilsService: UtilsService,
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
    private komubotrestService: KomubotrestService,
    private clientConfig: ClientConfigService
  ) {}

  async execute(message: Message, args, client: Client) {
    try {
      let authorId = message.author.id;
      const channel_id = message.channel.id;

      if (!args[0]) {
        const calendarChannel = message.channelId;
        let list = await this.meetingService.getListCalender(calendarChannel);

        let mess;
        if (!list || list.length === 0) {
          return message
            .reply({
              content: "`✅` No scheduled meeting.",
              // ephemeral: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
        } else {
          list = list.filter((item) => {
            return item.repeat !== "once" || item.createdTimestamp > Date.now();
          });
          if (list.length === 0) {
            return message
              .reply({
                content: "`✅` No scheduled meeting.",
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
          for (let i = 0; i <= Math.ceil(list.length / 50); i += 1) {
            if (list.slice(i * 50, (i + 1) * 50).length === 0) break;
            mess =
              "```" +
              "Calendar" +
              "\n" +
              list
                .slice(i * 50, (i + 1) * 50)
                .map((item) => {
                  const dateTime = this.utilsService.formatDate(
                    //formatDate
                    new Date(Number(item.createdTimestamp))
                  );
                  if (item.repeatTime) {
                    return `- ${item.task} ${dateTime} (ID: ${item.id}) ${item.repeat} ${item.repeatTime}`;
                  } else {
                    return `- ${item.task} ${dateTime} (ID: ${item.id}) ${item.repeat}`;
                  }
                })
                .join("\n") +
              "```";
            await message
              .reply({
                content: mess,
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
        }
      } else {
        if (args[0] === "now") {
          if (
            message.member.voice.channel &&
            message.member.voice.channel.type === 2
          ) {
            const voiceCheck = message.member.voice.channel;
            return message
              .reply({
                content: `Everyone please join the voice channel <#${voiceCheck.id}>`,
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
            let guild = await client.guilds.fetch(
              this.clientConfig.guild_komu_id
            );
            const getAllVoice = client.channels.cache.filter(
              (guild) =>
                guild.type == 2 &&
                (guild as VoiceChannel).parentId ===
                  this.clientConfig.guildvoice_parent_id
            );
            const voiceChannel = getAllVoice.map((item) => item.id);

            let roomMap = [];
            let countVoice = 0;
            let voiceNow = [];

            const findVoice = await this.meetingService.findStatusVoice();
            findVoice.map((item) => {
              voiceNow.push(item.id);
            });
            const newList = voiceChannel.map(async (voice, index) => {
              const userDiscord = await client.channels.fetch(voice);
              if ((userDiscord as VoiceChannel).members.size > 0) {
                countVoice++;
              }
              if ((userDiscord as VoiceChannel).members.size === 0) {
                roomMap.push(userDiscord.id);
              }
              let roomVoice = roomMap.filter(
                (room) => !voiceNow.includes(room)
              );
              if (index === voiceChannel.length - 1) {
                if (countVoice === voiceChannel.length) {
                  {
                    await message
                      .reply({
                        content: `Voice channel full`,
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
                } else {
                  const roomRandom = Math.floor(
                    Math.random() * roomVoice.length
                  );
                  if (roomVoice.length !== 0) {
                    await message
                      .reply({
                        content: `Our meeting room is <#${roomVoice[roomRandom]}>`,
                        // ephemeral: true,
                      })
                      .catch((err) => {
                        this.komubotrestService.sendErrorToDevTest(
                          client,
                          authorId,
                          err
                        );
                      });
                  } else
                    await message
                      .reply({
                        content: `Voice channel full`,
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
              }
            });
          }
        } else if (args[0] === "cancel") {
          if (!args[1])
            return message.channel
              .send("```" + "*report help" + "```")
              .catch(console.error);
          const id = args[1];
          const findId = await this.meetingService.cancelMeetingById(id);
          if (!findId) {
            return message
              .reply({
                content: "Not found.",
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
            return message
              .reply({
                content: "`✅` Cancel successfully.",
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
        } else if (args[0] === "meet") {
          message
            .reply({
              content: "Đang tạo phòng họp",
              // ephemeral: true
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
          puppeteer.use(StealthPlugin());
          (async () => {
            const browser = await puppeteer.launch({
              headless: true,
              args: [
                "--disable-notifications",
                "--mute-audio",
                "--enable-automation",
              ],
              // ignoreDefaultArgs: true,
            });

            // going to sign-in page
            const page = await browser.newPage();
            const navigationPromise = page.waitForNavigation();
            await page.goto("https://accounts.google.com/");

            const context = browser.defaultBrowserContext();
            await context.overridePermissions("https://meet.google.com/", [
              "microphone",
              "camera",
              "notifications",
            ]);

            await navigationPromise;

            // typing out email
            await page.waitForSelector('input[type="email"]');
            await page.click('input[type="email"]');
            await navigationPromise;
            await page.keyboard.type(`${this.clientConfig.komubotrestgmail}`, {
              delay: 200,
            });
            await page.waitForTimeout(15000);

            await page.waitForSelector("#identifierNext");
            await page.click("#identifierNext");

            // typing out password
            await page.waitForTimeout(10000);
            await page.keyboard.type(`${this.clientConfig.komubotrestpass}`, {
              delay: 200,
            });
            await page.waitForTimeout(800);
            await page.keyboard.press("Enter");
            await navigationPromise;

            // going to Meet after signing in
            await page.waitForTimeout(2500);
            await page.goto("https://meet.google.com/");
            await page.waitForTimeout(5000);
            await page.waitForSelector('div[class="VfPpkd-RLmnJb"]');
            await page.click('div[class="VfPpkd-RLmnJb"]');
            await page.waitForTimeout(3000);
            await page.waitForSelector(
              'li[class="JS1Zae VfPpkd-StrnGf-rymPhb-ibnC6b"]'
            );
            await page.click('li[class="JS1Zae VfPpkd-StrnGf-rymPhb-ibnC6b"]');
            await page.waitForTimeout(5000);

            // turn off cam using Ctrl+E
            await page.waitForTimeout(2000);
            await page.keyboard.down("ControlLeft");
            await page.keyboard.press("KeyE");
            await page.keyboard.up("ControlLeft");
            await page.waitForTimeout(2000);

            //turn off mic using Ctrl+D
            await page.waitForTimeout(1000);
            await page.keyboard.down("ControlLeft");
            await page.keyboard.press("KeyD");
            await page.keyboard.up("ControlLeft");
            await page.waitForTimeout(2000);
            const element = await page.waitForSelector('div[class="VA2JSc"]');
            const value = await element.evaluate((el) => el.textContent);
            message
              .reply({
                content: `https://${value}`,
                // ephemeral: true
              })
              .catch((err) => {
                this.komubotrestService.sendErrorToDevTest(
                  client,
                  authorId,
                  err
                );
              });

            await page.evaluate(async () => {
              await new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                  const button = document.querySelector(
                    'button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-dgl2Hf ksBjEc lKxP2d qfvgSe AjXHhf"]'
                  );
                  if (button) {
                    (button as any).click();
                  }
                }, 3000);
              });
            });
          })();
        } else {
          const task = args.slice(0, 1).join(" ");
          const datetime = args.slice(1, 3).join(" ");
          let repeat = args.slice(3, 4).join(" ");
          let repeatTime = args.slice(4, args.length).join(" ");
          const checkDate = args.slice(1, 2).join(" ");
          const checkTime = args.slice(2, 3).join(" ");
          if (
            !/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/.test(
              checkDate
            )
          ) {
            return message
              .reply({
                content: messHelp,
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
          if (!/(2[0-3]|[01][0-9]):[0-5][0-9]/.exec(checkTime)) {
            return message
              .reply({
                content: messHelp,
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

          if (repeat === "") repeat = "once";
          const list = ["once", "daily", "weekly", "repeat"];
          if (list.includes(repeat) === false)
            return message
              .reply({
                content: messHelp,
                // ephemeral: true
              })
              .catch((err) => {
                this.komubotrestService.sendErrorToDevTest(
                  client,
                  authorId,
                  err
                );
              });

          const day = datetime.slice(0, 2);
          const month = datetime.slice(3, 5);
          const year = datetime.slice(6);

          const fomat = `${month}/${day}/${year}`;
          const dateObject = new Date(fomat);
          const timestamp = dateObject.getTime();
          await this.meetingRepository.insert({
            channelId: channel_id,
            task: task,
            createdTimestamp: timestamp,
            repeat: repeat,
            repeatTime: repeatTime,
          });

          message
            .reply({
              content: "`✅` Meeting saved.",
              // ephemeral: true
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
