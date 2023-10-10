export interface IReportMsg {
  result: {
    VINH: number;
    HANOI: number;
    HANOI2: number;
    HANOI3: number;
    DANANG: number;
    QUYNHON: number;
    SAIGON: number;
    SAIGON2: number;
  };
}

export interface IReportKomubot {
  result: {
    totalUserActive: number;
    totalDailyOfToday: number;
    totalMsgOfToday: number;
    totalMeeting: number;
    totalChannel: number;
  };
}
