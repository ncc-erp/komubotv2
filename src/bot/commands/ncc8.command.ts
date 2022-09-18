<<<<<<< HEAD
// const audioPlayer = require('../utils/audioPlayer.utils');
// const uploadFileData = require('../models/uploadFile');
// const { MessageEmbed } = require('discord.js');
// const { sendErrorToDevTest } = require('../utils/komubotrest.utils');

// const checkNumber = (string) =>
//   !isNaN(parseFloat(string)) && !isNaN(string - 0) && parseInt(string);

// module.exports = {
//   name: 'ncc8',
//   description: 'Ncc8',
//   cat: 'komu',
//   async execute(message, args, client) {
//     try {
//       let authorId = message.author.id;
//       if (args[0] === 'playlist') {
//         dataMp3 = await uploadFileData.find().sort({ episode: -1 });
//         if (!dataMp3) {
//           return;
//         } else if (Array.isArray(dataMp3) && dataMp3.length === 0) {
//           mess = '```' + 'Không có NCC nào' + '```';
=======
// import { DataSource, Repository } from "typeorm";
// import { CommandLine, CommandLineClass } from "../base/command.base";
// import { checkNumber } from "../utils/number.utils";

// const { sendErrorToDevTest } = require("../../util/komubotrest");
// import { Message, Client, EmbedBuilder } from "discord.js";
// import { AudioPlayer } from "../models/uploadFileData";
// import { InjectRepository } from "@nestjs/typeorm";

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
//     @InjectRepository(AudioPlayer)
//     private orderReposistory: Repository<AudioPlayer>
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
//         let dataMp3 = await this.orderReposistory.find().sort({ episode: -1 });
//         if (!dataMp3) {
//           return;
//         } else if (Array.isArray(dataMp3) && dataMp3.length === 0) {
//           let mess = "```" + "Không có NCC nào" + "```";
>>>>>>> task/entity
//           return message.reply(mess).catch((err) => {
//             sendErrorToDevTest(client, authorId, err);
//           });
//         } else {
//           for (let i = 0; i <= Math.ceil(dataMp3.length / 50); i += 1) {
//             if (dataMp3.slice(i * 50, (i + 1) * 50).length === 0) break;
<<<<<<< HEAD
//             mess = dataMp3
//               .slice(i * 50, (i + 1) * 50)
//               .filter((item) => item.episode)
//               .map((list) => `NCC8 số ${list.episode}`)
//               .join('\n');
//             const Embed = new MessageEmbed()
//               .setTitle('Danh sách NCC8')
//               .setColor('RED')
=======
//             let mess = dataMp3
//               .slice(i * 50, (i + 1) * 50)
//               .filter((item) => item.episode)
//               .map((list) => `NCC8 số ${list.episode}`)
//               .join("\n");
//             const Embed = new EmbedBuilder()
//               .setTitle("Danh sách NCC8")
//               .setColor("Red")
>>>>>>> task/entity
//               .setDescription(`${mess}`);
//             await message.reply({ embeds: [Embed] }).catch((err) => {
//               sendErrorToDevTest(client, authorId, err);
//             });
//           }
//         }
<<<<<<< HEAD
//       } else if (args[0] === 'play') {
//         if (args[0] !== 'play' || !args[1]) {
//           return message
//             .reply('```' + '*ncc8 play episode' + '```')
=======
//       } else if (args[0] === "play") {
//         if (args[0] !== "play" || !args[1]) {
//           return message
//             .reply("```" + "*ncc8 play episode" + "```")
>>>>>>> task/entity
//             .catch((err) => {
//               sendErrorToDevTest(client, authorId, err);
//             });
//         }
//         if (!checkNumber(args[1])) {
//           return message
<<<<<<< HEAD
//             .reply('```' + 'episode must be number' + '```')
=======
//             .reply("```" + "episode must be number" + "```")
>>>>>>> task/entity
//             .catch((err) => {
//               sendErrorToDevTest(client, authorId, err);
//             });
//         }
<<<<<<< HEAD
//         await audioPlayer(client, message, args[1]);
//       } else {
//         return message
//           .reply('```' + '*ncc8 play episode' + '```')
=======
//         // await audioPlayer(client, message, args[1]);
//       } else {
//         return message
//           .reply("```" + "*ncc8 play episode" + "```")
>>>>>>> task/entity
//           .catch((err) => {
//             sendErrorToDevTest(client, authorId, err);
//           });
//       }
//     } catch (err) {
//       console.log(err);
//     }
<<<<<<< HEAD
//   },
// };
=======
//   }
// }
>>>>>>> task/entity
