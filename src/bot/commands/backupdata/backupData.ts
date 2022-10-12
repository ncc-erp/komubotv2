import { CommandLine, CommandLineClass } from "../../base/command.base";
import * as mongodb from "mongodb";
import { Client } from "pg";
import { Message } from "discord.js";
import { ConfigService } from "@nestjs/config"

const MongoClient = mongodb.MongoClient;
const url = "mongodb://172.16.100.196:27017";

@CommandLine({
  name: "backup",
  description: "backup data",
  cat: "komu",
})
export class BackupCommand implements CommandLineClass {
  clientPg4: Client
  constructor(private configService: ConfigService) {
    this.clientPg4 = new Client({
      host: this.configService.get('POSTGRES_HOST'),
      user: this.configService.get('POSTGRES_USER'),
      database: this.configService.get('POSTGRES_DB'),
      password: this.configService.get('POSTGRES_PASSWORD'),
      port: this.configService.get('POSTGRES_PORT'),
    });
  }
  
  async execute(message: Message, args) {
    try {
      await this.clientPg4.connect();
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
                } else if (result.length) {
                  result.map(async (item) => {
                    if (!item.roles || !item.roles_discord) {
                      if (
                        !item.scores_quiz ||
                        !item.flags ||
                        !item.bot ||
                        !item.deactive ||
                        !item.botping
                      ) {
                        await this.clientPg4.query(
                          `INSERT INTO komu_user("userId", "username","discriminator","avatar",
                      "system","email","last_mentioned_message_id","last_message_id")
                      VALUES ('${item.id}','${item.username}','${item.discriminator}', '${item.avatar}',
                      '${item.system}','${item.email}',
                      '${item.last_mentioned_message_id}','${item.last_message_id}'
                      )`
                        );
                      } else {
                        await this.clientPg4.query(
                          `INSERT INTO komu_user("userId", "username","discriminator","avatar","bot",
                      "system","email","flags","deactive","last_mentioned_message_id","last_message_id","scores_quiz","botPing")
                      VALUES ('${item.id}','${item.username}','${item.discriminator}', '${item.avatar}',
                      '${item.bot}','${item.system}','${item.email}','${item.flags}','${item.deactive}',
                      '${item.last_mentioned_message_id}','${item.last_message_id}','${item.scores_quiz}'
                      ,'${item.botPing}
                      )`
                        );
                      }
                    } else {
                      if (
                        item.roles_discord.length != 0 ||
                        item.roles.length != 0
                      ) {
                        const sumWithInitialRoleDiscord =
                          item.roles_discord.reduce(
                            (previousValue, currentValue) =>
                              previousValue + "'" + currentValue + "',",
                            ""
                          );

                        const sumWithInitialRole = item.roles.reduce(
                          (previousValue, currentValue) =>
                            previousValue + "'" + currentValue + "',",
                          ""
                        );
                        console.log(sumWithInitialRoleDiscord, "1");
                        console.log(sumWithInitialRole, "2");

                        if (
                          !item.scores_quiz ||
                          !item.flags ||
                          !item.bot ||
                          !item.deactive ||
                          !item.botping
                        ) {
                          await this.clientPg4.query(
                            `INSERT INTO komu_user("userId", "username","discriminator","avatar",
                        "system","email","last_mentioned_message_id","last_message_id","roles","roles_discord")
                        VALUES ('${item.id}','${item.username}','${
                              item.discriminator
                            }', '${item.avatar}',
                        '${item.system}','${item.email}',
                        '${item.last_mentioned_message_id}','${
                              item.last_message_id
                            }',
                        ARRAY[${sumWithInitialRole.slice(
                          0,
                          sumWithInitialRole.length - 1
                        )}]::text[],
                        ARRAY[${sumWithInitialRoleDiscord.slice(
                          0,
                          sumWithInitialRoleDiscord.length - 1
                        )}]::text[])`
                          );
                        } else {
                          await this.clientPg4.query(
                            `INSERT INTO komu_user("userId", "username","discriminator","avatar","bot",
                        "system","email","flags","deactive","last_mentioned_message_id","last_message_id","scores_quiz","botPing","roles","roles_discord")
                        VALUES ('${item.id}','${item.username}','${
                              item.discriminator
                            }', '${item.avatar}',
                        '${item.bot}','${item.system}','${item.email}','${
                              item.flags
                            }','${item.deactive}',
                        '${item.last_mentioned_message_id}','${
                              item.last_message_id
                            }','${item.scores_quiz}'
                        ,'${item.botPing},ARRAY[${sumWithInitialRole.slice(
                              0,
                              sumWithInitialRole.length - 1
                            )}]::string[],
                        ARRAY[${sumWithInitialRoleDiscord.slice(
                          0,
                          sumWithInitialRoleDiscord.length - 1
                        )}]::string[])`
                          );
                        }
                      }
                    }
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });
          } else {
            db.collection("komu_birthdays")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.clientPg4.query(
                      `INSERT INTO komu_birthdays("title") VALUES ('${item.title}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_checklists")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
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

            db.collection("komu_subcategorys")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.clientPg4.query(
                      `INSERT INTO komu_subcategorys("title") VALUES ('${item.title}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_meetings")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
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

            db.collection("komu_women_days")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    await this.clientPg4.query(
                      `INSERT INTO komu_womenday("userId", "win", "gift") VALUES ('${item.userid}','${item.win}','${item.gift}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_reminds")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);

                    await this.clientPg4.query(
                      `INSERT INTO komu_remind("channelId", "mentionUserId", "authorId", "content", "cancel", "createdTimestamp") VALUES (
                      '${item.channelId}','${item.mentionUserId}','${item.authorId}, '${item.content}', '${item.cancel}', '${item.createdTimestamp}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_wikis")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO komu_wiki("name", "value", "type", "creator", "status", "createdate", "note") VALUES (
                    '${item.name}','${item.value}','${item.type}, '${item.creator}', '${item.status}', '${item.createdate}', '${item.note}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_datings")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO komu_dating("channelId", "userId", "email", "sex", "loop", "createdTimestamp") VALUES (
                  '${item.channelId}','${item.userId}','${item.email}, '${item.sex}', '${item.loop}', '${item.createdTimestamp}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_opentalks")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO komu_opentalk("userId", "username", "createdTimestamp") VALUES (
                    '${item.userId}','${item.username}, '${item.createdTimestamp}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("suggs")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO sugg("autorID", "messageID", "serverID", "content", "Date") VALUES (
                  '${item.autorID}','${item.messageID}, '${item.serverID}', '${item.Date}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_wfhs")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO komu_wfh("user", "wfhMsg", "createdAt", "complain", "pmconfirm", "status", "data", "type") VALUES (
                    '${item.user}','${item.wfhMsg}, '${item.createdAt}', '${item.complain}', '${item.pmconfirm}', '${item.status}', '${item.data}', '${item.type})`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("guilds")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO guild("serverID", "description", "content", "reason") VALUES (
                  '${item.serverID}','${item.description}, '${item.content}', '${item.reason}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_keeps")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO komu_keep("userId", "note", "start_time", "status") VALUES (
                  '${item.userId}','${item.note}, '${item.start_time}', '${item.status}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_dailys")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO komu_daily("userId", "email", "daily", "createdAt", "channelid") VALUES (
                '${item.userId}','${item.email}, '${item.daily}', '${item.createdAt}', '${item.channelid}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_holidays")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO komu_holiday("dateTime", "content") VALUES (
              '${item.dateTime}','${item.content}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_companytrips")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO komu_companytrip("year", "fullName", "userId", "email", "phone", "office", "role", "kingOfRoom", "room") VALUES (
              '${item.year}','${item.fullName}', '${item.userId}', '${item.email}', '${item.phone}', '${item.office}', '${item.role}', '${item.kingOfRoom}', '${item.room}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_checkCameras")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO komu_checkCamera("userId", "channelId", "enableCamera", "createdTimestamp") VALUES (
              '${item.userId}','${item.channelId}', '${item.enableCamera}', '${item.createdTimestamp}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_channels")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO komu_channel("name", "type", "nsfw", "rawPosition", "lastMessageId", "rateLimitPerUser", "parentId") VALUES (
              '${item.name}','${item.type}', '${item.nsfw}', '${item.rawPosition}', '${item.lastMessageId}', '${item.rateLimitPerUser}', '${item.parentId})`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            db.collection("komu_joinCalls")
              .find()
              .toArray(async (err, result) => {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                  result.map(async (item) => {
                    console.log(item);
                    await this.clientPg4.query(
                      `INSERT INTO komu_joinCall("channelId", "userId", "status", "start_time", "end_time") VALUES (
            '${item.channelId}','${item.userId}', '${item.status}', '${item.start_time}', '${item.end_time}')`
                    );
                  });
                } else {
                  console.log(
                    'No document(s) found with defined "find" criteria!'
                  );
                }
                
              });

            //   db.collection("komu_mentioneds")
            //     .find()
            //     .toArray(async (err, result) => {
            //       if (err) {
            //         console.log(err);
            //       } else if (result.length) {
            //         result.map(async (item) => {
            //           console.log(item);
            //           await clientPg4.query(
            //             `INSERT INTO komu_mentioned("messageId", "authorId", "channelId", "mentionUserId", "createdTimestamp", "noti", "confirm", "punish", "reactionTimestamp") VALUES (
            // '${item.messageId}','${item.authorId}', '${item.channelId}', '${item.mentionUserId}', '${item.createdTimestamp}','${item.noti}', '${item.confirm}','${item.punish}', '${item.reactionTimestamp}')`
            //           );
            //         });
            //       } else {
            //         console.log(
            //           'No document(s) found with defined "find" criteria!'
            //         );
            //       }
            //       
            //     });

            //   db.collection("komu_orders")
            //     .find()
            //     .toArray(async (err, result) => {
            //       if (err) {
            //         console.log(err);
            //       } else if (result.length) {
            //         result.map(async (item) => {
            //           console.log(item);
            //           await clientPg4.query(
            //             `INSERT INTO komu_order("userId", "channelId", "menu", "username", "isCancel", "createdTimestamp") VALUES (
            // '${item.userId}', '${item.channelId}', '${item.menu}', '${item.username}','${item.isCancel}', '${item.createdTimestamp}')`
            //           );
            //         });
            //       } else {
            //         console.log(
            //           'No document(s) found with defined "find" criteria!'
            //         );
            //       }
            //       
            //     });

            //   db.collection("komu_penatlys")
            //     .find()
            //     .toArray(async (err, result) => {
            //       if (err) {
            //         console.log(err);
            //       } else if (result.length) {
            //         result.map(async (item) => {
            //           console.log(item);
            //           await clientPg4.query(
            //             `INSERT INTO komu_penatly("userId", "username", "ammount", "reason", "createdTimestamp", "isReject", "channelId", "delete") VALUES (
            // '${item.userId}', '${item.username}','${item.ammount}', '${item.reason}', '${item.createdTimestamp}', '${item.isReject}', '${item.channelId}', '${item.delete}')`
            //           );
            //         });
            //       } else {
            //         console.log(
            //           'No document(s) found with defined "find" criteria!'
            //         );
            //       }
            //       
            //     });
              db.collection("komu_tickets")
                .find()
                .toArray(async (err, result) => {
                  if (err) {
                    console.log(err);
                  } else if (result.length) {
                    result.map(async (item) => {
                      console.log(item);
                      await this.clientPg4.query(
                        `INSERT INTO komu_ticket("title", "desc", "asignee", "creator", "status", "createdate", "note") VALUES (
            '${item.title}', '${item.desc}','${item.asignee}', '${item.creator}', '${item.status}', '${item.createdate}', '${item.note}')`
                      );
                    });
                  } else {
                    console.log(
                      'No document(s) found with defined "find" criteria!'
                    );
                  }
                  
                });
          }
        }
      });
    } catch (err) {
      console.log('131232')
      console.log(err);
    }
  }
}
