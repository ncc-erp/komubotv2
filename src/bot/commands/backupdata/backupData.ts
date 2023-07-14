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
                  message.reply("saved");
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
                  console.log(result.length);
                  result.map(async (item) => {
                    await this.backupService.checklist(item);
                  });
                  message.reply("saved");
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
                  message.reply("saved");
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
                    await this.backupService.saveMeeting(item);
                  });
                  message.reply("saved");
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
                  message.reply("saved");
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
                    message.reply("saved");
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
                    message.reply("saved");
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
                    const promises = []
                    for (let item of result) {
                      try {
                        promises.push(this.backupService.saveBwls(item))
                      } catch (error) {
                        continue;
                      }
                    }
                    try {
                      await Promise.all(promises)
                      message.reply("saved");
                    } catch (error) {
                      console.log(error)
                    }
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
                    message.reply("saved");
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
                  message.reply("saved");
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
                  message.reply("saved");
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
                  message.reply("saved");
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
                  message.reply("saved");
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
                  message.reply("saved");
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
                  message.reply("saved");
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
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "remind") {
            db.collection("komu_reminds")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.backupService.saveRemind(item);
                  });
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "question") {
            db.collection("komu_questions")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.backupService.saveQuiz(item);
                  });
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "penalty") {
            db.collection("komu_penatlies")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.backupService.savePenatly(item);
                  });
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "order") {
            db.collection("komu_orders")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.backupService.saveOrder(item);
                  });
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "msg") {
            db.collection("komu_msgs")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  const lengthArr = Math.floor(result.length / 1000);
                  const array = Array.from(Array(lengthArr + 1).keys());
                  console.log(array);
                  array.map((arr) => {
                    result.map(async (item, index) => {
                      if (index >= arr * 1000 && index < (arr + 1) * 1000) {
                        return await this.backupService.saveMsg(item);
                      } else return;
                    });
                  });
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "mention") {
            db.collection("komu_mentioneds")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.backupService.saveMention(item);
                  });
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "leave") {
            db.collection("komu_leaves")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.backupService.saveLeave(item);
                  });
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "keep") {
            db.collection("komu_keeps")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  console.log(result.length);
                  result.map(async (item) => {
                    await this.backupService.saveKeep(item);
                  });
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "joincall") {
            db.collection("komu_joincalls")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.backupService.saveJoinCall(item);
                  });
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "holiday") {
            db.collection("komu_holidays")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.backupService.saveHoliday(item);
                  });
                  message.reply("saved");
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
              });
          } else if (args[0] === "guilddata") {
            db.collection("komu_guilddatas")
              .find()
              .toArray(async (err, result) => {
                try {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    result.map(async (item) => {
                      await this.backupService.saveGuildData(item);
                    });
                    message.reply("saved");
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                    message.reply(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              });
          } else if (args[0] === "guild") {
          } else if (args[0] === "dating") {
            db.collection("komu_datings")
              .find()
              .toArray(async (err, result) => {
                try {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    result.map(async (item) => {
                      await this.backupService.saveDating(item);
                    });
                    message.reply("saved");
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                    message.reply(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              });
          } else if (args[0] === "conversation") {
            db.collection("komu_conversations")
              .find()
              .toArray(async (err, result) => {
                try {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    result.map(async (item) => {
                      await this.backupService.saveConversation(item);
                    });
                    message.reply("saved");
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                    message.reply(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              });
          } else if (args[0] === "companytrip") {
            db.collection("komu_companytrips")
              .find()
              .toArray(async (err, result) => {
                try {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    result.map(async (item) => {
                      await this.backupService.companytrip(item);
                    });
                    message.reply("saved");
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                    message.reply(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              });
          } else if (args[0] === "checkCamera") {
            db.collection("komu_check_cameras")
              .find()
              .toArray(async (err, result) => {
                try {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    result.map(async (item) => {
                      await this.backupService.checkcamera(item);
                    });
                    message.reply("saved");
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                    message.reply(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              });
          } else if (args[0] === "channel") {
            db.collection("komu_channels")
              .find()
              .toArray(async (err, result) => {
                try {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    result.map(async (item) => {
                      await this.backupService.channel(item);
                    });
                    message.reply("saved");
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                    message.reply(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              });
          } else if (args[0] === "bwlReaction") {
            db.collection("komu_bwlreactions")
              .find()
              .toArray(async (err, result) => {
                try {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    const promises = []
                    result.forEach((item) => {
                      promises.push(this.backupService.bwlReaction(item))
                    });

                    await Promise.all(promises)
                    message.reply("saved");
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              });
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}
