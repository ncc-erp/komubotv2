
export class RequestOrder {
  withoutFirstTime(dateTime) {
    const date = new Date(dateTime);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  withoutLastTime(dateTime) {
    const date = new Date(dateTime);
    date.setHours(23, 59, 59, 999);
    return date;
  }

  getYesterdayDate() {
    console.log('hello');
    const today = new Date();
    const yesterday = new Date(this.withoutLastTime(today));
    yesterday.setDate(yesterday.getDate() - 1);
    console.log(new Date(yesterday).valueOf());
    return new Date(yesterday).valueOf();
  }

  getTomorrowDate() {
    const today = new Date();
    const yesterday = new Date(this.withoutFirstTime(today));
    yesterday.setDate(yesterday.getDate() + 1);
    return new Date(yesterday).valueOf();
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
  checkNumber = (string) =>
    !isNaN(parseFloat(string)) && !isNaN(string - 0) && parseInt(string);
}
