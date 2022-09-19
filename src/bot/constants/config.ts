export const Config = {
  wfh: {
    api_url: `${process.env.TIMESHEET_API}Public/GetUserWorkFromHome`,
  },
  user_status: {
    api_url_userstatus: `${process.env.TIMESHEET_API}Public/GetWorkingStatusByUser`,
  },
};
