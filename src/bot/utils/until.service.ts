import { Injectable } from "@nestjs/common";
import { subDays } from "date-fns";

@Injectable()
export class UntilService {
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

  formatDate(date) {
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

  checkNumber = (string) =>
    !isNaN(parseFloat(string)) && !isNaN(string - 0) && parseInt(string);
}
