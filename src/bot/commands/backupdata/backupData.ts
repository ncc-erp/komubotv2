import { CommandLine, CommandLineClass } from "../../base/command.base";
import * as mongodb from "mongodb";
import { Client } from "pg";
import { Message } from "discord.js";
import { ConfigService } from "@nestjs/config";
import { BackupService } from "./backupData.service";

const MongoClient = mongodb.MongoClient;
const url = "mongodb://172.16.100.196:27017";

@CommandLine({
  name: "backup",
  description: "backup data",
  cat: "komu",
})
export class BackupCommand implements CommandLineClass {
  clientPg4: Client;
  constructor(
    private configService: ConfigService,
    private backupService: BackupService
  ) {
    this.clientPg4 = new Client({
      host: this.configService.get("POSTGRES_HOST"),
      user: this.configService.get("POSTGRES_USER"),
      database: this.configService.get("POSTGRES_DB"),
      password: this.configService.get("POSTGRES_PASSWORD"),
      port: this.configService.get("POSTGRES_PORT"),
    });
  }

  async execute(message: Message, args) {
    try {
      if (args[1]) await this.clientPg4.connect();
      MongoClient.connect(url, (err, client) => {
        if (err) {
          console.log("Unable to connect to the mongoDB server. Error:", err);
        } else {
          console.log("Connection established to", url);

          const db = client.db("komubot");
          if (args[0] === "user") {
            db.collection("komu_users")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                  return message.reply(err as any);
                } else if (result.length) {
                  console.log(result.length);
                  result.map(async (item) => {
                    await this.backupService.saveUser(item);
                  });
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "birthday") {
            db.collection("komu_birthdays")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.backupService.saveBirthday(item);
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "checklist") {
            db.collection("komu_checklists")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);

                    const sumWithInitial = item.category.reduce(
                      (previousValue, currentValue) =>
                        previousValue + "'" + currentValue + "',",
                      ""
                    );
                    await this.clientPg4.query(
                      `INSERT INTO komu_checklist("subcategory", "category") VALUES ('${
                        item.subcategory
                      }', ARRAY[${sumWithInitial.slice(
                        0,
                        sumWithInitial.length - 1
                      )}])`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "subcategory") {
            db.collection("komu_subcategorys")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.backupService.saveSubcategory(item);
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "meeting") {
            db.collection("komu_meetings")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);

                    if (
                      item.cancel === undefined ||
                      item.reminder === undefined
                    )
                      return;
                    if (item.repeatTime === undefined) item.repeatTime = null;
                    await this.clientPg4.query(
                      `INSERT INTO komu_meeting("channelId", "task", "repeat", "cancel", "reminder", "repeatTime", "createdTimestamp") VALUES ('${item.channelId}','${item.task}','${item.repeat}','${item.cancel}','${item.reminder}','${item.repeatTime}','${item.createdTimestamp}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "daily") {
            db.collection("komu_dailies")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  console.log(result.length);
                  result.map(async (item) => {
                    await this.backupService.saveDaily(item);
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "workout") {
            db.collection("komu_workoutdailies")
              .find()
              .toArray(async (err, result) => {
                try {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    console.log(result.length);
                    result.map(async (item) => {
                      await this.backupService.saveWorkout(item);
                    });
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              });
          } else if (args[0] === "opentalk") {
            db.collection("komu_opentalks")
              .find()
              .toArray(async (err, result) => {
                try {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    console.log(result.length);
                    result.map(async (item) => {
                      await this.backupService.saveOpentalk(item);
                    });
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              });
          } else if (args[0] === "bwl") {
            db.collection("komu_bwls")
              .find()
              .toArray(async (err, result) => {
                try {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    console.log(result.length);
                    result.map(async (item) => {
                      await this.backupService.saveBwls(item);
                    });
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              });
          } else if (args[0] === "wiki") {
            db.collection("komu_wikis")
              .find()
              .toArray(async (err, result) => {
                try {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    console.log(result.length);
                    result.map(async (item) => {
                      await this.backupService.saveWiki(item);
                    });
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              });
          } else if (args[0] === "womenday") {
            db.collection("komu_women_days")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  console.log(result.length);
                  result.map(async (item) => {
                    await this.backupService.saveWomenday(item);
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "wfh") {
            db.collection("komu_wfhs")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  console.log(result.length);
                  result.map(async (item) => {
                    await this.backupService.saveWfh(item);
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "voicechanels") {
            db.collection("komu_voicechannels")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  console.log(result.length);
                  result.map(async (item) => {
                    await this.backupService.saveVoiechannel(item);
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "userquiz") {
          } else if (args[0] === "uploadfile") {
            db.collection("komu_uploadfiles")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  console.log(result.length);
                  result.map(async (item) => {
                    await this.backupService.saveUploadFile(item);
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "tx8") {
            db.collection("komu_tx8")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  console.log(result.length);
                  result.map(async (item) => {
                    await this.backupService.saveTx8(item);
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "trackerspenttime") {
            db.collection("komu_tracker_spent_time")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  console.log(result.length);
                  result.map(async (item) => {
                    await this.backupService.saveTrackerSpent(item);
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "timeVoiceAlone") {
            db.collection("komu_timevoicealones")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  console.log(result.length);
                  result.map(async (item) => {
                    await this.backupService.saveTimevoicealones(item);
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "remind") {
          } else if (args[0] === "question") {
          } else if (args[0] === "penalty") {
          } else if (args[0] === "order") {
          } else if (args[0] === "msg") {
          } else if (args[0] === "mention") {
          } else if (args[0] === "leave") {
          } else if (args[0] === "keep") {
          } else if (args[0] === "joincall") {
          } else if (args[0] === "holiday") {
          } else if (args[0] === "guilddata") {
          } else if (args[0] === "guild") {
          } else if (args[0] === "dating") {
          } else if (args[0] === "conversation") {
          } else if (args[0] === "companytrip") {
          } else if (args[0] === "checkCamera") {
          } else if (args[0] === "channel") {
          } else if (args[0] === "bwlReaction") {
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}
