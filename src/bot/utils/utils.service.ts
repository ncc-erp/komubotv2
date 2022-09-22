import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { subDays } from "date-fns";
import { Repository } from "typeorm";
import { Holiday } from "../models/holiday.entity";

@Injectable()
export class UtilsService {
  constructor(
    @InjectRepository(Holiday)
    private holidayReposistory: Repository<Holiday>
  ) {}

  getYesterdayDate() {
    return subDays(new Date().setHours(23, 59, 59, 999), 1).getTime();
  }

  getTomorrowDate() {
    return subDays(new Date().setHours(0, 0, 0, 0), -1).getTime();
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
    const holiday = await this.holidayReposistory.find({
      where: {
        dateTime: time,
      },
    });

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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays % multiples === 0) {
      result = true;
    }
    return result;
  }

  isTimeDay(newDateTimestamp) {
    let result = false;
    if ((this.checkTimeMeeting() as any).dateTimeNow - newDateTimestamp >= 0) {
      result = true;
    }
    return result;
  }

  formatDate(date) {
    const dateNow = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const month = dateNow.slice(0, 2);
    const day = dateNow.slice(3, 5);
    const year = dateNow.slice(6);

    return `${day}/${month}/${year}`;
  }

  async checkHolidayMeeting(date) {
    const format = this.formatDate(date);
    if (date.getDay() === 6 || date.getDay() === 0) {
      return true;
    }
    const holiday = await this.holidayReposistory.find({
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

  sendErrorToDevTest = async (client, authorId, err) => {
    const msg = `KOMU không gửi được tin nhắn cho <@${authorId}> message: ${err.message} httpStatus: ${err.httpStatus} code: ${err.code}.`;
    await client.channels.cache
      .get("1020251275796955236")
      .send(msg)
      .catch(console.error);
    return null;
  };

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
  sendMessageKomuToUser = async (
    client,
    msg,
    username,
    botPing = false,
    isSendQuiz = false,
    userData,
    msgData
  ) => {
    try {
      const userdb = await userData
        .createQueryBuilder("users")
        .where(
          '"email" = :email AND "deactive" IS NOT True OR "username" = :username AND "deactive" IS NOT True',
          { email: username, username: username }
        )
        .select("users.*")
        .execute()
        .catch(console.error);

      if (!userdb) {
        return null;
      }
      console.log(userdb[0].userId, "ádffsda");
      const user = await client.users
        .fetch(userdb[0].userId)
        .catch(console.error);
      if (msg == null) {
        return user;
      }
      if (!user) {
        // notify to machleo channel
        const message = `<@${process.env.KOMUBOTREST_ADMIN_USER_ID}> ơi, đồng chí ${username} không đúng format rồi!!!`;
        await client.channels.cache
          .get(process.env.KOMUBOTREST_MACHLEO_CHANNEL_ID)
          .send(message)
          .catch(console.error);
        return null;
      }
      const sent = await user.send(msg);
      console.log(sent);

      await msgData.insert(sent);

      // botPing : work when bot send quiz wfh user
      // isSendQuiz : work when bot send quiz
      if (botPing && isSendQuiz) {
        userdb.last_bot_message_id = sent.id;
        userdb.botPing = true;
      }
      if (!botPing && isSendQuiz) {
        userdb.last_bot_message_id = sent.id;
      }

      await userdb.save();
      return user;
    } catch (error) {
      console.log("error", error);
      const userDb = await userData
        .createQueryBuilder("users")
        .where(
          '"email" = :email AND "deactive" IS NOT True OR "username" = :username AND "deactive" IS NOT True',
          { email: username, username: username }
        )
        .select("users.*")
        .execute()
        .catch(console.error);
      const message = `KOMU không gửi được tin nhắn cho <@${userDb[0].userId}>(${userDb[0].email}). Hãy ping <@${process.env.KOMUBOTREST_ADMIN_USER_ID}> để được hỗ trợ nhé!!!`;
      await client.channels.cache
        .get(process.env.KOMUBOTREST_MACHLEO_CHANNEL_ID)
        .send(message)
        .catch(console.error);
      const messageItAdmin = `KOMU không gửi được tin nhắn cho <@${userDb[0].id}(${userDb[0].email})>. <@${process.env.KOMUBOTREST_ADMIN_USER_ID}> hỗ trợ nhé!!!`;
      await client.channels.cache
        .get(process.env.KOMUBOTREST_ITADMIN_CHANNEL_ID)
        .send(messageItAdmin)
        .catch(console.error);
      return null;
    }
  };
}
