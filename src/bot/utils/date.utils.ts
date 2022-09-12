function withoutFirstTime(dateTime) {
  const date = new Date(dateTime);
  date.setHours(0, 0, 0, 0);
  return date;
}

function withoutLastTime(dateTime) {
  const date = new Date(dateTime);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function getYesterdayDate() {
  const today = new Date();
  const yesterday = new Date(withoutLastTime(today));
  yesterday.setDate(yesterday.getDate() - 1);
  return new Date(yesterday).valueOf();
}

export function getTomorrowDate() {
  const today = new Date();
  const yesterday = new Date(withoutFirstTime(today));
  yesterday.setDate(yesterday.getDate() + 1);
  return new Date(yesterday).valueOf();
}
function setTime(date, hours, minute, second, msValue) {
  return date.setHours(hours, minute, second, msValue);
}

export function checkTimeSchulderNCC8() {
  let result = false;
  const time = new Date();
  const cur = new Date();
  const timezone = time.getTimezoneOffset() / -60;
  const day = time.getDay();
  const fisrtTime = new Date(setTime(time, 6 + timezone, 15, 0, 0)).getTime();
  const lastTime = new Date(setTime(time, 7 + timezone, 15, 0, 0)).getTime();
  if (cur.getTime() >= fisrtTime && cur.getTime() <= lastTime && day == 5) {
    result = true;
  }
  return result;
}
