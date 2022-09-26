import axios from "axios";
import parseDuration from "parse-duration";
import * as chrono from "chrono-node";

let DEBUG = false;
export const normalizeString = (str) => {
  return (str || "").trim();
};

export const parseTimeSheetTask = (chunk) => {
  const [note, meta] = (chunk || "").split(";");
  const [timeRaw, type, name] = (meta || "").split(",");
  const time = normalizeString(timeRaw);
  const duration = parseDuration(time);
  const task = {
    note: normalizeString(note),
    time: time,
    duration: duration,
    type: normalizeString(type),
    name: normalizeString(name),
  };
  return task;
};

export const parseTimeSheetSentence = (sentence) => {
  const chunks = sentence.split(new RegExp("\\+", "ig"));
  const items = chunks
    .filter((chunk) => chunk.trim())
    .map((chunk) => parseTimeSheetTask(chunk));
  return items;
};

export const parseDailyMessage = (message) => {
  const [, metaRaw, yesterday, todayRaw, block] = message.split(
    new RegExp("\\*daily|- yesterday:|- today:|- block:", "ig")
  );
  const [projectRaw, dateRaw] = metaRaw.trim().split(/\s+/);
  const dateStr = dateRaw
    ? normalizeString(dateRaw)
    : normalizeString(projectRaw);
  const projectCode = dateRaw ? normalizeString(projectRaw) : null;
  const todayStr = normalizeString(todayRaw);
  const date = chrono.parseDate(dateStr);
  const tasks = parseTimeSheetSentence(todayStr);
  const contentObj = {
    date: dateStr,
    projectCode,
    timeStamp: date,
    yesterday: normalizeString(yesterday),
    today: todayStr,
    block: normalizeString(block),
    tasks,
  };
  return contentObj;
};

export const parseTimesheetMessage = (message) => {
  const [, metaRaw, ...taskRaw] = message.split(
    new RegExp("\\*timesheet|\\+", "ig")
  );
  const [projectRaw, dateRaw] = metaRaw.trim().split(/\s+/);
  const dateStr = dateRaw
    ? normalizeString(dateRaw)
    : normalizeString(projectRaw);
  const projectCode = dateRaw ? normalizeString(projectRaw) : null;
  const date = chrono.parseDate(dateStr);
  const tasks = taskRaw
    .filter((chunk) => chunk.trim())
    .map((chunk) => parseTimeSheetTask(chunk));
  const contentObj = {
    date: dateStr,
    projectCode,
    timeStamp: date,
    tasks,
  };
  return contentObj;
};

export const validateTimesheetFormat = (contentObj) => {
  const INVALID_TIME = !contentObj.timeStamp;
  const EMPTY_TASKS = !contentObj.tasks.length;
  const INVALID_TASKS = !validateTasks(contentObj.tasks);
  if (
    INVALID_TIME ||
    EMPTY_TASKS ||
    INVALID_TASKS ||
    !contentObj.projectCode ||
    contentObj.projectCode === ""
  ) {
    return false;
  }
  return true;
};

export const validateTasks = (tasks) => {
  for (const task of tasks) {
    if (
      task.note === "" ||
      task.time === "" ||
      task.type === "" ||
      task.name === "" ||
      !task.duration ||
      !["ot", "nt"].includes(task.type)
    ) {
      return false;
    }
  }
  return true;
};

export const checkHelpMessage = (contentObj) => {
  if (
    contentObj?.date === "help" &&
    contentObj?.projectCode === null &&
    contentObj?.timeStamp === null &&
    !contentObj?.tasks.length
  ) {
    return true;
  }
  return false;
};

export const logTimeSheetForTask = async ({
  task,
  projectCode,
  emailAddress,
}) => {
  const typeOfWork = task.type === "ot" ? 1 : 0;
  const hour = task.duration ? task.duration / 3600000 : 0;
  const taskName = task.name;
  const timesheetPayload = {
    note: task.note,
    emailAddress,
    projectCode,
    typeOfWork,
    taskName,
    hour,
  };

  const url =
    !hour || !projectCode
      ? `${process.env.TIMESHEET_API}MyTimesheets/CreateByKomu`
      : `${process.env.TIMESHEET_API}MyTimesheets/CreateFullByKomu`;

  const response = await axios.post(url, timesheetPayload, {
    headers: {
      "X-Secret-Key": process.env.WFH_API_KEY_SECRET,
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);

  return response;
};

export const getProjectOfUser = async (email) => {
  const url = getDebug()
    ? "http://timesheetapi.nccsoft.vn/api/services/app/Public/GetPMsOfUser"
    : `${process.env.TIMESHEET_API}Public/GetPMsOfUser`;
  const projects =
    (
      await axios.get(`${url}?email=${email}`, {
        headers: {
          "X-Secret-Key": process.env.WFH_API_KEY_SECRET,
        },
      })
    )?.data?.result || [];
  return projects.map((item) => ({
    projectName: item?.projectName || "",
    projectCode: item?.projectCode || "",
  }));
};

export const logTimeSheetFromDaily = async ({ content, emailAddress }) => {
  const data = parseDailyMessage(content);
  const projectCode = data.projectCode;
  const results = [];
  console.log(data)
  for (const task of data.tasks) {
    try {
      const response = await logTimeSheetForTask({
        projectCode,
        task,
        emailAddress,
      });
      const result = response.data;
      results.push(result);
    } catch (e) {
      console.log(e);
      results.push({
        success: false,
        result:
          e.response && e.response.message ? e.response.message : e.message,
      });
    }
  }
};

export const debug = (...messages) => {
  if (DEBUG) console.log(...messages);
};
export const setDebug = () => (DEBUG = true);
export const getDebug = () => DEBUG;
