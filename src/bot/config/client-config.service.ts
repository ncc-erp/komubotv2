import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ClientConfigService {
  constructor(configService: ConfigService) {
    this.prefix = "*";
    this.wfh = {
      api_url: `${configService.get<string>(
        "TIMESHEET_API"
      )}Public/GetUserWorkFromHome`,
    };
    this.ticket = {
      api_url_create: `${configService.get<string>(
        "TIMESHEET_API"
      )}KomuJobService/CreateJob`,
      api_url_get: `${configService.get<string>(
        "INFO_API"
      )}KomuJobService/GetJobs`,
    };

    this.role = {
      api_url_getRole: `${configService.get<string>(
        "PROJECT_API"
      )}User/GetEmployeeInformation`,
    };
    this.user_status = {
      api_url_userstatus: `${configService.get<string>(
        "TIMESHEET_API"
      )}Public/GetWorkingStatusByUser`,
    };
    this.submitTimesheet = {
      api_url_getListUserLogTimesheet: `${configService.get<string>(
        "TIMESHEET_API"
      )}Public/GetListUserLogTimesheetThisWeekNotOk`,
      api_url_logTimesheetByKomu: `${configService.get<string>(
        "TIMESHEET_API"
      )}MyTimesheets/CreateByKomu`,
      api_url_logTimesheetFullByKomu: `${configService.get<string>(
        "TIMESHEET_API"
      )}MyTimesheets/CreateFullByKomu`,
    };
    this.project = {
      api_url_getListProjectOfUser: `${configService.get<string>(
        "TIMESHEET_API"
      )}Public/GetPMsOfUser`,
    };
    this.checkinTimesheet = {
      api_url: `${configService.get<string>(
        "TIMESHEET_API"
      )}Public/GetTimesheetAndCheckInOutAllUser`,
    };
    this.wiki = {
      api_url: `${configService.get<string>(
        "PROJECT_API"
      )}User/GetEmployeeInformation?email=`,
      options: [
        "all",
        "note",
        "link",
        "code",
        "file",
        "image",
        "cmd",
        "event",
        "pm",
        "hr",
        "komu",
        "policy",
        "office",
        "project",
        "ot",
        "checkpoint",
        "timesheet",
        "tx8",
        "fun",
        "help",
      ],
    };
    this.gem = {
      api_url_getMyRank: `${configService.get<string>(
        "GEMSOFGOD_API"
      )}komu/get-my-ranking/`,
      api_url_getTopRank: `${configService.get<string>(
        "GEMSOFGOD_API"
      )}komu/get-top-ranking`,
    };
    this.noti = {
      api_url_quickNews: `${configService.get<string>(
        "IMS_API"
      )}services/app/QuickNews/Create`,
    };
    this.categories = {
      configuration: {
        enabled: true,
        name: "Configuration",
        desc: "Setup the bot with the configuration commands",
      },
      utilities: {
        enabled: true,
        name: "Utilities",
        desc: "Some usefull commands",
        aliases: ["general"],
      },
      music: { enabled: true, name: "Music", desc: "Listen music with KOMU" },
      komu: { enabled: true, name: "Task", desc: "KOMU task manager" },
      slash: { enabled: true, name: "Poll", desc: "KOMU poll manager" },
      owner: {
        hide: true,
        enabled: true,
        name: "Owner",
        desc: "Manage your bot with the owner commands",
      },
    };

    this.owners = ["KOMU#0139"];
    //The footer of the embeds that the bot will send
    this.footer = "KOMU ";
    // The id of the support
    this.supportID = "729774155037278268";
    // The status of your bot
    this.game = "KOMU ";
    //the color of the embeds
    this.color = "#3A871F";
    // OPTIONAL: Your top.gg token.
    this.topgg = "TOPGG_TOKEN";
    // OPTIONAL: The link of your bot's top.gg page.
    this.topgg_url = "https://top.gg/bot/783708073390112830";
    //the default bot language. fr or en
    this.defaultLanguage = "en";
    // If dev mod is enabled
    this.devMode = false;
    // The server where you test the commands
    this.devServer = "782661233622515772";
    // If you want to log every command,event etc. Usefull for debuging
    this.logAll = false;
    // If you want to test your configuration before starting the bot
    this.checkConfig = null;
    //The number of shards. Leave blank for auto
    this.shards = 1;
  }

  wfh: {
    api_url: string;
  };
  ticket: {
    api_url_create: string;
    api_url_get: string;
  };
  role: {
    api_url_getRole: string;
  };
  user_status: {
    api_url_userstatus: string;
  };
  submitTimesheet: {
    api_url_getListUserLogTimesheet: string;
    api_url_logTimesheetByKomu: string;
    api_url_logTimesheetFullByKomu: string;
  };

  project: {
    api_url_getListProjectOfUser: string;
  };

  checkinTimesheet: {
    api_url: string;
  };
  wiki: {
    api_url: string;
    options: string[];
  };
  gem: {
    api_url_getMyRank: string;
    api_url_getTopRank: string;
  };
  noti: {
    api_url_quickNews: string;
  };

  prefix: string;
  // Your ID
  // Your name/tag
  owners: string[];
  //The footer of the embeds that the bot will send
  footer: string;
  // The id of the support
  supportID: string;
  // The status of your bot
  game: string;
  //the color of the embeds
  color: string;
  // OPTIONAL: Your top.gg token.
  topgg: string;
  // OPTIONAL: The link of your bot's top.gg page.
  topgg_url: string;
  //the default bot language. fr or en
  defaultLanguage: string;
  // If dev mod is enabled
  devMode: boolean;
  // The server where you test the commands
  devServer: string;
  // If you want to log every command,event etc. Usefull for debuging
  logAll: boolean;
  // If you want to test your configuration before starting the bot
  checkConfig: any;
  //The number of shards. Leave blank for auto
  shards: number;
  // The categories. Put null to enabled to disable a category
  categories: any;
}
