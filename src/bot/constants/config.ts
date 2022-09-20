export const config = {
  submitTimesheet: {
    api_url_getListUserLogTimesheet: `http://timesheetapi.nccsoft.vn/api/services/app/Public/GetListUserLogTimesheetThisWeekNotOk`,
    api_url_logTimesheetByKomu: `${process.env.TIMESHEET_API}MyTimesheets/CreateByKomu`,
    api_url_logTimesheetFullByKomu: `${process.env.TIMESHEET_API}MyTimesheets/CreateFullByKomu`,
  },
};
