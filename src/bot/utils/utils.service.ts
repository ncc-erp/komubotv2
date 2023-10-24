import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { subDays } from "date-fns";
import { Repository } from "typeorm";
import { Holiday } from "../models/holiday.entity";

const timeUTC = 60000 * 60 * 7;
@Injectable()
export class UtilsService {
  constructor(
    @InjectRepository(Holiday)
    private holidayRepository: Repository<Holiday>
  ) {}

  getYesterdayDate() {
    return subDays(new Date().setHours(23, 59, 59, 999), 1).getTime() - timeUTC;
  }

  getTomorrowDate() {
    return subDays(new Date().setHours(0, 0, 0, 0), -1).getTime() - timeUTC;
  }
  setTime(date, hours, minute, second, msValue) {
    return date.setHours(hours, minute, second, msValue);
  }

  checkTimeSchulderNCC8() {
    let result = false;
    const time = new Date();
    const cur = new Date();
    const timezone = time.getTimezoneOffset() / -60;
    const day = time.getDay();
    const fisrtTime = new Date(
      this.setTime(time, 6 + timezone, 15, 0, 0)
    ).getTime();
    const lastTime = new Date(
      this.setTime(time, 7 + timezone, 15, 0, 0)
    ).getTime();
    if (cur.getTime() >= fisrtTime && cur.getTime() <= lastTime && day == 5) {
      result = true;
    }
    return result;
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  checkNumber = (string) =>
    !isNaN(parseFloat(string)) && !isNaN(string - 0) && parseInt(string);

  async checkHoliday() {
    let data = [];
    let result = false;
    const today = new Date();
    const time =
      today.getDate().toString().padStart(2, "0") +
      "/" +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      today.getFullYear();
    const holiday = await this.holidayRepository
    .createQueryBuilder()
    .where('"dateTime" = :time', { time: time })
    .select("*")
    .getQuery();
    // await this.holidayRepository.find({
    //   where: {
    //     dateTime: time,
    //   },
    // });
    console.log(holiday);

    if (holiday.length > 0) {
      result = true;
    }
    return result;
  }

  checkTimeMeeting() {
    const dateTimeNow = new Date();
    dateTimeNow.setHours(dateTimeNow.getHours() + 7);
    let day = dateTimeNow.getDay();
    const hourDateNow = dateTimeNow.getHours();
    const dateNow = dateTimeNow.toLocaleDateString("en-US");
    const minuteDateNow = dateTimeNow.getMinutes();
    dateTimeNow.setHours(0, 0, 0, 0);

    return {
      day: day,
      dateTimeNow: dateTimeNow,
      hourDateNow: hourDateNow,
      dateNow: dateNow,
      minuteDateNow: minuteDateNow,
    };
  }

  isSameDate(dateCreatedTimestamp) {
    let result = false;
    if (this.checkTimeMeeting().dateNow === dateCreatedTimestamp) {
      result = true;
    }
    return result;
  }

  isSameDay() {
    let result = false;
    if (
      this.checkTimeMeeting().day === 0 ||
      this.checkTimeMeeting().day === 6
    ) {
      result = true;
    }
    return result;
  }

  isSameMinute(minuteDb, dateScheduler) {
    let result = false;
    let checkFiveMinute;
    let hourTimestamp;
    if (minuteDb >= 0 && minuteDb <= 4) {
      checkFiveMinute = minuteDb + 60 - this.checkTimeMeeting().minuteDateNow;
      const hourDb = dateScheduler;
      const setHourTimestamp = hourDb.setHours(hourDb.getHours() - 1);
      hourTimestamp = new Date(setHourTimestamp).getHours();
    } else {
      checkFiveMinute = minuteDb - this.checkTimeMeeting().minuteDateNow;
      hourTimestamp = dateScheduler.getHours();
    }
    if (
      this.checkTimeMeeting().hourDateNow === hourTimestamp &&
      0 <= checkFiveMinute &&
      checkFiveMinute <= 5
    ) {
      result = true;
    }
    return result;
  }

  isDiffDay(newDateTimestamp, multiples) {
    let result = false;
    newDateTimestamp.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(
      (this.checkTimeMeeting() as any).dateTimeNow - newDateTimestamp
    );
    const millisecondsOfDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.ceil(diffTime / millisecondsOfDay);
    if (diffDays % multiples === 0) {
      result = true;
    }
    return result;
  }

  isTimeDay(newDateTimestamp) {
    newDateTimestamp.setHours(0, 0, 0, 0);
    let result = false;
    if ((this.checkTimeMeeting() as any).dateTimeNow - newDateTimestamp >= 0) {
      result = true;
    }
    return result;
  }

  formatDate(time) {
    const today = new Date(time);
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const hours = today.getHours().toString().padStart(2, "0");
    const minutes = today.getMinutes().toString().padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hours}:${minutes}`;
  }

  async checkHolidayMeeting(date) {
    const format = this.formatDate(date);
    if (date.getDay() === 6 || date.getDay() === 0) {
      return true;
    }
    const holiday = await this.holidayRepository.find({
      where: {
        dateTime: format,
      },
    });
    return holiday.length > 0;
  }

  formatDateTimeReminder(date) {
    const d = [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/");

    const t = [
      this.padTo2Digits(date.getHours()),
      this.padTo2Digits(date.getMinutes()),
    ].join(":");

    return `${d} ${t}`;
  }

  getUserNameByEmail(string) {
    if (string.includes("@ncc.asia")) {
      return string.slice(0, string.length - 9);
    }
  }

  checkTime(time) {
    if (!time) return false;
    let result = false;
    const curDate = new Date();
    const timezone = curDate.getTimezoneOffset() / -60;
    const fFistTime = new Date(
      this.setTime(curDate, 6 + timezone, 0, 0, 0)
    ).getTime();
    const lFistTime = new Date(
      this.setTime(curDate, 6 + timezone, 30, 0, 0)
    ).getTime();

    const lLastTime = new Date(
      this.setTime(curDate, 10 + timezone, 25, 0, 0)
    ).getTime();

    if (
      (time.getTime() >= fFistTime && time.getTime() < lFistTime) ||
      time.getTime() >= lLastTime
    ) {
      result = true;
    }

    return result;
  }

  withoutTime(dateTime) {
    const date = new Date(dateTime);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  validateTimeDDMMYYYY(time) {
    return /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(
      time
    );
  }

  formatDayMonth(time) {
    const day = time.split("").slice(0, 2).join("");
    const month = time.split("").slice(3, 5).join("");
    const year = time.split("").slice(6, 10).join("");
    return `${month}/${day}/${year}`;
  }

  getTimeWeek(time) {
    let curr;
    if (time) {
      if (!this.validateTimeDDMMYYYY(time)) {
        return;
      }
      const timeFormat = this.formatDayMonth(time);
      curr = new Date(timeFormat);
    } else {
      curr = new Date();
    }
    // current date of week
    const currentWeekDay = curr.getDay();
    const lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
    const firstweek = new Date(
      new Date(curr).setDate(curr.getDate() - lessDays)
    );
    const lastweek = new Date(
      new Date(firstweek).setDate(firstweek.getDate() + 7)
    );

    return {
      firstday: {
        timestamp: new Date(this.withoutTime(firstweek)).getTime(),
        date: this.formatDate(new Date(this.withoutTime(firstweek))),
      },
      lastday: {
        timestamp: new Date(this.withoutTime(lastweek)).getTime(),
        date: this.formatDate(new Date(this.withoutTime(lastweek))),
      },
    };
  }

  withoutTimeWFH(dateTime) {
    const date = new Date(dateTime);
    const curDate = new Date();
    const timezone = curDate.getTimezoneOffset() / -60;
    date.setHours(0 + timezone, 0, 0, 0);
    return date;
  }

  getTimeToDay(date) {
    let today;
    let tomorrows;
    if (date) {
      today = new Date(date);
      tomorrows = new Date(date);
    } else {
      today = new Date();
      tomorrows = new Date();
    }
    const tomorrowsDate = tomorrows.setDate(tomorrows.getDate() + 1);

    return {
      firstDay: new Date(this.withoutTimeWFH(today)),
      lastDay: new Date(this.withoutTimeWFH(tomorrowsDate)),
    };
  }

  getDateDay(time) {
    let date;

    if (!time) {
      date = new Date();
    } else {
      date = new Date(time);
    }
    const timezone = date.getTimezoneOffset() / -60;
    return {
      morning: {
        fisttime: new Date(this.setTime(date, 0 + timezone, 0, 0, 0)).getTime(),
        lastime: new Date(this.setTime(date, 2 + timezone, 31, 0, 0)).getTime(),
      },
      afternoon: {
        fisttime: new Date(this.setTime(date, 5 + timezone, 0, 0, 0)).getTime(),
        lastime: new Date(this.setTime(date, 11 + timezone, 1, 0, 0)).getTime(),
      },
      fullday: {
        fisttime: new Date(this.setTime(date, 0 + timezone, 0, 0, 0)).getTime(),
        lastime: new Date(this.setTime(date, 10 + timezone, 0, 0, 0)).getTime(),
      },
    };
  }

  withoutLastTime(dateTime) {
    const date = new Date(dateTime);
    date.setHours(23, 59, 59, 999);
    return date;
  }

  getyesterdaydate() {
    const today = new Date();
    const yesterday = new Date(this.withoutLastTime(today));
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      yesterday.getFullYear() +
      "-" +
      (yesterday.getMonth() + 1) +
      "-" +
      yesterday.getDate()
    );
  }
  withoutTimeMention(dateTime) {
    const date = new Date(dateTime);
    const curDate = new Date();
    const timezone = curDate.getTimezoneOffset() / -60;
    date.setHours(0 + timezone, 0, 0, 0);
    return date;
  }

  getTimeToDayMention(fomatDate) {
    let today;
    let tomorrows;
    if (fomatDate) {
      today = new Date(fomatDate);
      tomorrows = new Date(fomatDate);
    } else {
      today = new Date();
      tomorrows = new Date();
    }
    const tomorrowsDate = tomorrows.setDate(tomorrows.getDate() + 1);

    return {
      firstDay: new Date(this.withoutTimeMention(today)),
      lastDay: new Date(this.withoutTimeMention(tomorrowsDate)),
    };
  }

  getTimeWeekMondayToSunday(dayNow) {
    const curr = new Date();
    const currentWeekDay = curr.getDay();
    const lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
    const firstweek = new Date(
      new Date(curr).setDate(curr.getDate() - lessDays)
    );
    const arrayDay = Array.from(
      { length: 9 - dayNow - 1 },
      (v, i) => i + dayNow + 1
    );

    function getDayofWeek(rank) {
      return new Date(
        new Date(firstweek).setDate(firstweek.getDate() + rank - 2)
      );
    }
    return arrayDay.map((item) => getDayofWeek(item));
  }
}
