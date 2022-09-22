export function getTimeWeek() {
  let curr = new Date();
  // current date of week
  const currentWeekDay = curr.getDay();
  const lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
  const firstweek = new Date(new Date(curr).setDate(curr.getDate() - lessDays));
  const lastweek = new Date(
    new Date(firstweek).setDate(firstweek.getDate() + 7)
  );

  return {
    firstday: {
      timestamp: new Date(withoutTime(firstweek)).getTime(),
    },
    lastday: {
      timestamp: new Date(withoutTime(lastweek)).getTime(),
    },
  };
}

export function withoutTime(dateTime) {
  const date = new Date(dateTime);
  date.setHours(0, 0, 0, 0);
  return date;
}
