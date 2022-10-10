import { CommandLine, CommandLineClass } from "../../base/command.base";
import * as mongodb from "mongodb";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BirthDay } from "src/bot/models/birthday.entity";
import { Client } from "pg";

const MongoClient = mongodb.MongoClient;
const url = "mongodb://172.16.100.196:27017";

const clientPg4 = new Client({
  host: "localhost",
  user: "postgres",
  database: "komubot",
  password: "123456789",
  port: 5432,
});

@CommandLine({
  name: "backup",
  description: "backup data",
  cat: "komu",
})
export class BackupCommand implements CommandLineClass {
  constructor() {}
  async execute() {
    try {
      await clientPg4.connect();
      MongoClient.connect(url, function (err, client) {
        if (err) {
          console.log("Unable to connect to the mongoDB server. Error:", err);
        } else {
          console.log("Connection established to", url);

          const db = client.db("komubot");

          // db.collection("komu_birthdays")
          //   .find()
          //   .toArray(async function (err, result) {
          //     if (err) {
          //       console.log(err);
          //     } else if (result.length) {
          //       result.map(async (item) => {
          //         await clientPg4.query(
          //           `INSERT INTO komu_birthdays("title") VALUES ('${item.title}')`
          //         );
          //       });
          //     } else {
          //       console.log(
          //         'No document(s) found with defined "find" criteria!'
          //       );
          //     }
          //     client.close();
          //   });

          // db.collection("komu_questions")
          //   .find()
          //   .toArray(async function (err, result) {
          //     if (err) {
          //       console.log(err);
          //     } else if (result.length) {
          //       result.map(async (item) => {
          //         await clientPg4.query(
          //           `INSERT INTO komu_question("title", "options", "correct", "role", "isVerify","accept","author_email", "topic") VALUES('${item.title}', ARRAY[${sumWithInitial.slice(0, sumWithInitial.length - 1)}]),'${item.correct}', '${item.role}', '${item.isVerify}', '${item.accept}', '${item.author_email}', '${item.topic})`
          //         );
          //       });
          //     } else {
          //       console.log(
          //         'No document(s) found with defined "find" criteria!'
          //       );
          //     }
          //     client.close();
          //   });
          db.collection("komu_questions")
            .find()
            .toArray(async function (err, result) {
              if (err) {
                console.log(err);
              } else if (result.length) {
                result.map(async (item) => {
                  console.log(item);

                  const sumWithOptions = item.options.reduce(
                    (previousValue, currentValue) =>
                      previousValue + "'" + currentValue + "',",
                    ""
                  );
                  await clientPg4.query(
                    `INSERT INTO komu_question("title", "options", "correct", "role", "isVerify","accept","author_email", "topic") VALUES ('${
                      item.title
                    }', ARRAY[${sumWithOptions.slice(
                      0,
                      sumWithOptions.length - 1
                    )}], '${item.correct}', '${item.role}', '${
                      item.isVerify
                    }', '${item.accept}', '${item.author_email}', '${
                      item.topic
                    }')`
                  );
                });
              } else {
                console.log(
                  'No document(s) found with defined "find" criteria!'
                );
              }
              client.close();
            });

          // db.collection("komu_checklists")
          //   .find()
          //   .toArray(async function (err, result) {
          //     if (err) {
          //       console.log(err);
          //     } else if (result.length) {
          //       result.map(async (item) => {
          //         const sumWithInitial = item.category.reduce(
          //           (previousValue, currentValue) =>
          //             previousValue + "'" + currentValue + "',",
          //           ""
          //         );
          //         await clientPg4.query(
          //           `INSERT INTO komu_checklist("subcategory", "category") VALUES ('${
          //             item.subcategory
          //           }', ARRAY[${sumWithInitial.slice(0, sumWithInitial.length - 1)}])`
          //         );
          //       });
          //     } else {
          //       console.log(
          //         'No document(s) found with defined "find" criteria!'
          //       );
          //     }
          //     client.close();
          //   });

          // db.collection("komu_subcategorys")
          //   .find()
          //   .toArray(async function (err, result) {
          //     if (err) {
          //       console.log(err);
          //     } else if (result.length) {
          //       result.map(async (item) => {
          //         await clientPg4.query(
          //           `INSERT INTO komu_subcategorys("title") VALUES ('${item.title}')`
          //         );
          //       });
          //     } else {
          //       console.log(
          //         'No document(s) found with defined "find" criteria!'
          //       );
          //     }
          //     client.close();
          //   });

          // db.collection("komu_meetings")
          //   .find()
          //   .toArray(async function (err, result) {
          //     if (err) {
          //       console.log(err);
          //     } else if (result.length) {
          //       result.map(async (item) => {
          //         if (item.cancel === undefined || item.reminder === undefined)
          //           return;
          //         if (item.repeatTime === undefined) item.repeatTime = null;
          //         await clientPg4.query(
          //           `INSERT INTO komu_meeting("channelId", "task", "repeat", "cancel", "reminder", "repeatTime", "createdTimestamp") VALUES ('${item.channelId}','${item.task}','${item.repeat}','${item.cancel}','${item.reminder}','${item.repeatTime}','${item.createdTimestamp}')`
          //         );
          //       });
          //     } else {
          //       console.log(
          //         'No document(s) found with defined "find" criteria!'
          //       );
          //     }
          //     client.close();
          //   });

          // db.collection("komu_women_days")
          //   .find()
          //   .toArray(async function (err, result) {
          //     if (err) {
          //       console.log(err);
          //     } else if (result.length) {
          //       result.map(async (item) => {
          //         await clientPg4.query(
          //           `INSERT INTO komu_womenday("userId", "win", "gift") VALUES ('${item.userid}','${item.win}','${item.gift}')`
          //         );
          //       });
          //     } else {
          //       console.log(
          //         'No document(s) found with defined "find" criteria!'
          //       );
          //     }
          //     client.close();
          //   });

          // db.collection("komu_users")
          //   .find()
          //   .toArray(async function (err, result) {
          //     if (err) {
          //       console.log(err);
          //     } else if (result.length) {
          //       result.map(async (item) => {
          //         const sumWithInitial = item.category.reduce(
          //           (previousValue, currentValue) =>
          //             previousValue + "'" + currentValue + "',",
          //           ""
          //         );
          //         await clientPg4.query(
          //           `INSERT INTO komu_checklist("subcategory", "category") VALUES ('${
          //             item.subcategory
          //           }', ARRAY[${sumWithInitial.slice(0, sumWithInitial.length - 1)}])`
          //         );
          //       });
          //     } else {
          //       console.log(
          //         'No document(s) found with defined "find" criteria!'
          //       );
          //     }
          //     client.close();
          //   });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}
