import { Injectable } from "@nestjs/common";
import { AttachmentBuilder, Client, EmbedBuilder, Message } from "discord.js";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { startOfWeek, format, toDate } from "date-fns";

@Injectable()
export class OdinReportService {
  constructor() {}

  delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  async downloadKomuWeeklyReport({
    url,
    username,
    password,
    reportPath,
    screenUrl,
  }) {
    if (!url || !username || !password || !reportPath || !screenUrl) {
      throw new Error("missing odin credentials.");
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 768, height: 1366 });
      await page.goto(url);
      await page.type("#username", username);
      await page.type("#password", password);
      await page.click('input[type="submit"]');
      await this.delay(1000);

      await page.goto(screenUrl);
      await this.delay(10000);

      await page.click("#save-dash-split-button");
      await this.delay(1000);
      await page.click(".ant-dropdown ul li:last-child");
      await this.delay(10000);

      await page.screenshot({ path: reportPath, fullPage: true });
    } catch (e) {
      console.error(e);
    } finally {
      await browser.close();
    }
  }

  async getKomuWeeklyReport(options) {
    if (!options.reportName) {
      throw new Error("report name is not provided");
    }
    const reportNameDir = path.join(__dirname,"../../../..", "src/assets/odin-reports");
    if (!fs.existsSync(reportNameDir)) {
      fs.mkdirSync(reportNameDir);
    }

    const reportDate = startOfWeek(options.date || new Date());
    const reportDateStr = format(reportDate, "yyyy-mm-dd");
    const reportFileName = `${options.reportName}-${reportDateStr}.png`;
    const reportPath = path.join(reportNameDir, reportFileName);

    if (fs.existsSync(reportPath)) {
      return { filePath: reportPath };
    }

    await this.downloadKomuWeeklyReport({
      ...options,
      reportPath,
    });

    return { filePath: reportPath };
  }

  async handleKomuWeeklyReport(message: Message, args) {
    try {
      if (args[1] && args[1] == "help") {
        return message.reply({
          content:
            "View komu weekly report\n*report komuweekly [date]\n*note: date format dd/mm/yyyy",
          // ephemeral: true,
        });
      }

      const date = !args[1] ? new Date() : toDate(args[1]);

      if (isNaN(date.getTime())) {
        throw Error("invalid date provided");
      }

      const report = await this.getKomuWeeklyReport({
        reportName: "komu-weekly",
        url: process.env.ODIN_URL,
        username: process.env.ODIN_USERNAME,
        password: process.env.ODIN_PASSWORD,
        screenUrl: process.env.ODIN_KOMU_REPORT_WEEKLY_URL,
        date,
      });

      if (!report || !report.filePath || !fs.existsSync(report.filePath)) {
        throw new Error("requested report is not found");
      }

      const attachment = new AttachmentBuilder(report.filePath);
      const embed = new EmbedBuilder().setTitle("Komu report weekly");
      await message.channel.send({
        files: [attachment],
        //  embed: embed
      });
    } catch (error) {
      console.error(error);
      message.channel.send(`Sorry, ${error.message}`);
    }
  }
}
