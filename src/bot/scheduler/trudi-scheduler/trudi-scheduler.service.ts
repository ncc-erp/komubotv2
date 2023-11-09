import { Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import axios from "axios";
import puppeteer from "puppeteer";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { Client, TextChannel } from "discord.js";

@Injectable()
export class TrudiSchedulerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectDiscordClient()
    private client: Client
  ) {}
  private readonly TRUDI_URL = "https://www.trudi.ai/";
  private readonly logger = new Logger(TrudiSchedulerService.name);

  addCronJob(name: string, time: string, callback: () => void): void {
    const job = new CronJob(
      time,
      () => {
        this.logger.warn(`Trudi Crawl Css`);
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
    this.addCronJob("crawlCSSTrudi", CronExpression.EVERY_5_MINUTES, () =>
      this.crawlCSS()
    );
  }

  async crawlCSS() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const attribute = 'link[rel="stylesheet"]';
    try {
      await page.goto(this.TRUDI_URL);
      await page.waitForSelector(attribute);

      const cssLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll(attribute).forEach((element) => {
          links.push(element.getAttribute("href"));
        });
        return links;
      });

      await this.checkCSSLinks(cssLinks);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      await browser.close();
    }
  }

  async checkCSSLinks(cssLinks) {
    const HTTPS_PREFIX = "https://";
    for (let link of cssLinks) {
      try {
        if (!link.includes(HTTPS_PREFIX)) {
          link = this.TRUDI_URL + link;
        }
        await axios.get(link);
      } catch (error) {
        const errorMessage = `Error fetching CSS from ${link}: ${error.message}`;
        this.sendDiscordMessage(errorMessage);
      }
    }
  }

  async sendDiscordMessage(errorMessage) {
    const TRUDI_WEBSITE_THREAD = "1006051800979349528";
    const channel = await this.client.channels.fetch(TRUDI_WEBSITE_THREAD);
    (channel as TextChannel).send(errorMessage).catch(console.error);
  }
}
