import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Meeting } from "src/bot/models/meeting.entity";
import { VoiceChannels } from "src/bot/models/voiceChannel.entity";
import { Repository } from "typeorm";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";

@Injectable()
export class MeetingService {
  constructor(
    private clientConfig: ClientConfigService,
    private komubotrestService: KomubotrestService,
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
    @InjectRepository(VoiceChannels)
    private readonly voiceChannelRepository: Repository<VoiceChannels>
  ) {}

  async getListCalender(channelId) {
    return await this.meetingRepository
      .createQueryBuilder("meeting")
      .where(`"channelId" = :channelId`, { channelId: channelId })
      .andWhere(`"cancel" IS NOT true`)
      .select(`meeting.*`)
      .execute();
  }

  async findStatusVoice() {
    const test = await this.voiceChannelRepository.findBy({ status: "start" });
    return test;
  }

  async cancelMeetingById(id) {
    return await this.meetingRepository
      .createQueryBuilder("meeting")
      .update(Meeting)
      .set({
        cancel: true,
      })
      .where(`"id" = :id`, { id: id })
      .execute();
  }

  validateRepeatTime(repeatTime) {
    return repeatTime.length === 0 || /^[0-9]+$/.test(repeatTime);
  }

  validateDate(checkDate) {
    const dateRegex =
      /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/;
    return dateRegex.test(checkDate);
  }

  validateTime(checkTime) {
    const timeRegex = /(2[0-3]|[01][0-9]):[0-5][0-9]/;
    return timeRegex.test(checkTime);
  }

  validateRepeat(repeat) {
    const validRepeatValues = ["once", "daily", "weekly", "repeat", "monthly"];
    return validRepeatValues.includes(repeat);
  }

  async saveMeeting(channel_id, task, timestamp, repeat, repeatTime) {
    await this.meetingRepository.insert({
      channelId: channel_id,
      task: task,
      createdTimestamp: timestamp,
      repeat: repeat,
      repeatTime: repeatTime,
    });
  }

  async createRoomMeet(message, client, authorId) {
    try {
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
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
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
    } catch (error) {
      message
        .reply({
          content: `Room creation failed`,
          // ephemeral: true
        })
        .catch((err) => {
          this.komubotrestService.sendErrorToDevTest(client, authorId, err);
        });
    }
  }
}
