// import { InjectRepository } from "@nestjs/typeorm";
// import { Message, Client, EmbedBuilder } from "discord.js";
// import { DataSource, Repository } from "typeorm";
// import { CommandLine, CommandLineClass } from "../base/command.base";
// import { Channel } from "../models/channel.entity";
// import { User } from "../models/user.entity";
// import { sendErrorToDevTest } from "../utils/komubotrest.utils";

// const messHelp = `*mv <this|channel> <category>`;


// interface IChannel {
//   komu_Channel_id: number;
//   komu_Channel_name: string;
//   komu_Channel_type: string;
//   komu_Channel_nsfw: Boolean;
//   komu_Channel_rawPosition: number;
//   komu_Channel_lastMessageId: string;
//   komu_Channel_rateLimitPerUser: number;
//   komu_Channel_nsparentIdfw: string;
// }

// @CommandLine({
//   name: "channel",
//   description: "channel",
// })

// export default class ChannelCommand implements CommandLineClass {
//   constructor(
//     @InjectRepository(Channel)
//     private channelReposistory: Repository<Channel>
//   ) {}

//   async execute(message: Message, args, client, _, __, dataSource: DataSource) {
//     const mvChannelData = dataSource.getRepository(Channel);
    
//     try {
//       let authorId = message.author.id;
//       const checkRole = await mvChannelData.find({
//         // id: authorId,
//         // deactive: { $ne: true },
//         // $or: [{ roles_discord: { $all: ['PM'] } }],
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
//       if (args[0] && args[1]) {
//         const findCategory = args.slice(1, args.length).join(' ');

//         let category = client.channels.cache.find(
//           (cat) =>
//             cat.id === findCategory ||
//             cat.name.toUpperCase() === findCategory.toUpperCase()
//         );
//         const getChannel = client.channels.cache.find(
//           (guild) =>
//             guild.id === args[0] ||
//             guild.name.toUpperCase() === args[0].toUpperCase()
//         );

//         if (getChannel && category) {
//           const channel = await client.channels.fetch(getChannel.id);
//           channel.setParent(category.id, { lockPermissions: false });
//           await channelData.updateOne(
//             { id: args[0] },
//             { $set: { parentId: category.id } }
//           );
//           await message
//             .reply({
//               content: `move channel to ${category.name} successfully`,
              
//             })
//             .catch((err) => {
//               sendErrorToDevTest(client, authorId, err);
//             });
//         } else {
//           return message
//             .reply({ content: messHelp })
//             .catch((err) => {
//               sendErrorToDevTest(client, authorId, err);
//             });
//         }
//       } else {
//         return message
//           .reply({ content: messHelp })
//           .catch((err) => {
//             sendErrorToDevTest(client, authorId, err);
//           });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// };

