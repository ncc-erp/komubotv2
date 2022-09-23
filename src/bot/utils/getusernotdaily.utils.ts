export function getDateDay(time) {
  let date;

  if (!time) {
    date = new Date();
  } else {
    date = new Date(time);
  }
  const timezone = date.getTimezoneOffset() / -60;
  return {
    morning: {
      fisttime: new Date(setTime(date, 0 + timezone, 0, 0, 0)).getTime(),
      lastime: new Date(setTime(date, 2 + timezone, 31, 0, 0)).getTime(),
    },
    afternoon: {
      fisttime: new Date(setTime(date, 5 + timezone, 0, 0, 0)).getTime(),
      lastime: new Date(setTime(date, 7 + timezone, 1, 0, 0)).getTime(),
    },
    fullday: {
      fisttime: new Date(setTime(date, 0 + timezone, 0, 0, 0)).getTime(),
      lastime: new Date(setTime(date, 10 + timezone, 0, 0, 0)).getTime(),
    },
  };
}

export function setTime(date, hours, minute, second, msValue) {
  return date.setHours(hours, minute, second, msValue);
}

export function getUserNameByEmail(string) {
  if (string.includes("@ncc.asia")) {
    return string.slice(0, string.length - 9);
  }
}
