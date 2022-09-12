// import { DataSource, Repository } from "typeorm";
// import { CommandLine, CommandLineClass } from "../base/command.base";

// import { Message, Client, EmbedBuilder } from "discord.js";
// import { InjectRepository } from "@nestjs/typeorm";
// import { UploadFile } from "../models/uploadFile.entity";

// interface uploadFileData {
//   id: number;
//   filePath: string;
//   fileName: string;
//   createTimestamp: number;
//   episode: number;
// }

// @CommandLine({
//   name: "ncc8",
//   description: "Ncc8",
// })
// export default class OrderCommand implements CommandLineClass {
//   constructor(
//     @InjectRepository(UploadFile)
//     private orderReposistory: Repository<UploadFile>
//   ) {}

//   async execute(
//     message: Message,
//     args,
//     client,
//     __,
//     ___,
//     dataSource: DataSource
//   ) {
//     try {
//       let authorId = message.author.id;
//       if (args[0] === "playlist") {
//         let dataMp3 = await this.orderReposistory;

//         if (!dataMp3) {
//           return;
//         } else if (Array.isArray(dataMp3) && dataMp3.length === 0) {
//           let mess = "```" + "Không có NCC nào" + "```";
//           return message.reply(mess).catch((err) => {
//             sendErrorToDevTest(client, authorId, err);
//           });
//         } else {
//           for (let i = 0; i <= Math.ceil(dataMp3.length / 50); i += 1) {
//             if (dataMp3.slice(i * 50, (i + 1) * 50).length === 0) break;
//             let mess = dataMp3
//               .slice(i * 50, (i + 1) * 50)
//               .filter((item) => item.episode)
//               .map((list) => `NCC8 số ${list.episode}`)
//               .join("\n");
//             const Embed = new EmbedBuilder()
//               .setTitle("Danh sách NCC8")
//               .setColor("Red")
//               .setDescription(`${mess}`);
//             await message.reply({ embeds: [Embed] }).catch((err) => {
//               sendErrorToDevTest(client, authorId, err);
//             });
//           }
//         }
//       } else if (args[0] === "play") {
//         if (args[0] !== "play" || !args[1]) {
//           return message
//             .reply("```" + "*ncc8 play episode" + "```")
//             .catch((err) => {
//               sendErrorToDevTest(client, authorId, err);
//             });
//         }
//         if (!checkNumber(args[1])) {
//           return message
//             .reply("```" + "episode must be number" + "```")
//             .catch((err) => {
//               sendErrorToDevTest(client, authorId, err);
//             });
//         }
//         await audioPlayer(client, message, args[1]);
//       } else {
//         return message
//           .reply("```" + "*ncc8 play episode" + "```")
//           .catch((err) => {
//             sendErrorToDevTest(client, authorId, err);
//           });
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }
