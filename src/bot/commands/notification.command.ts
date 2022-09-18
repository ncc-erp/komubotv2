// import { InjectRepository } from "@nestjs/typeorm";
// import { Message} from "discord.js";
// import { sendErrorToDevTest } from "../utils/komubotrest.utils";
// import { DataSource, Repository } from "typeorm";
// import { CommandLine, CommandLineClass } from "../base/command.base";
// import { TABLE } from "../constants/table";
// import { User } from "../models/user.entity";
// import {HttpService} from '@nestjs/axios';

// interface Inotification {
//   komu_notification_id: number;
//   komu_notification_username: string;
//   komu_notification_discriminator: string;
//   komu_notification_avatar: string;
//   komu_notification_bot: string;
//   komu_notification_system: Boolean;
//   komu_notification_mfa_enabled: Boolean;
//   komu_notification_banner: string;
//   komu_notification_accent_color: string;
//   komu_notification_locale: string;
//   komu_notification_flags: number;
//   komu_notification_premium_type: number;
//   komu_notification_public_flags: number;
//   komu_notification_last_message_id: string;
//   komu_notification_last_mentioned_message_id: string;
//   komu_notification_scores_quiz: number;
//   komu_notification_roles: string[];
//   komu_notification_pending_wfh: boolean;
//   komu_notification_bot_message_id: string;
//   komu_notification_deactive: boolean;
//   komu_notification_roles_discord: string;
//   komu_notification_last_bot_message_id: string[];
//   komu_notification_botPing: boolean;
// }

// @CommandLine({
//   name: "user",
//   description: "user",
// })

// export default class UserCommand implements CommandLineClass {
//   constructor(
//     @InjectRepository(User)
//     private userReposistory: Repository<User>
//   ) {}

//   async execute(message:Message, args, client, _, __, dataSource: DataSource ) {
//     const userData = dataSource.getRepository(User);

//     try {
//       let authorId = message.author.id;
//       let noti = args.join(' ');
//       let checkRole = await user.find({
//         id: authorId,
//         deactive: { $ne: true },
//         $or: [
//           { roles_discord: { $all: ['ADMIN'] } },
//           { roles_discord: { $all: ['HR'] } },
//         ],
//       });

//       if (checkRole.length === 0) {
//         return message
//           .reply({
//             content:
//               '```You do not have permission to execute this command!```',
//           })
//           .catch((err) => {
//             sendErrorToDevTest(client, authorId, err);
//           });
//       }

//       if (!noti || noti == undefined) {
//         return message
//           .reply({
//             content: '```please add your text```',
//           })
//           .catch((err) => {
//             sendErrorToDevTest(client, authorId, err);
//           });
//       }

//       await axios.post(
//         client.config.noti.api_url_quickNews,
//         {
//           content: noti,
//         },
//         {
//           headers: {
//             securityCode: process.env.IMS_KEY_SECRET,
//           },
//         }
//       );
//       message
//         .reply({ content: '`✅` Notification saved.'})
//         .catch((err) => {
//           sendErrorToDevTest(client, authorId, err);
//         });
//       const fetchChannel = [
//         '922135616962068520',
//         '922402247260909569',
//         '935151571581423626',
//         '921686261943635988',
//         '921652536933499002',
//         '969511102885019688',
//         '921239541388554240',
//         '990141662665777172',
//       ];

//       fetchChannel.map(async (channel) => {
//         const userDiscord = await client.channels.fetch(channel);
//         if (message.attachments && message.attachments.first())
//           userDiscord
//             .send({
//               content: `${noti}`,
//               files: [message.attachments.first().url],
//             })
//             .catch(console.error);
//         else userDiscord.send(`${noti} `).catch(console.error);
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }
