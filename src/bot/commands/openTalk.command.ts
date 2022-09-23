// import { Opentalk } from "../models/opentalk.entity"

// interface IOpenatalk {
//   komu_order_id: number;
//   komu_order_userId: string;
//   komu_order_channelId: string;
//   komu_order_menu: string;
//   komu_order_username: string;
//   komu_order_isCancel: Boolean;
//   komu_order_createdTimestamp: number;
// }

// function getTimeWeek() {
//   let curr = new Date();
//   // current date of week
//   let currentWeekDay = curr.getDay();
//   let lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
//   let firstweek = new Date(new Date(curr).setDate(curr.getDate() - lessDays));
//   let lastweek = new Date(
//     new Date(firstweek).setDate(firstweek.getDate() + 7)
//   );

//   return {
//     firstday: {
//       timestamp: new Date(withoutTime(firstweek)).getTime(),
//     },
//     lastday: {
//       timestamp: new Date(withoutTime(lastweek)).getTime(),
//     },
//   };
// }

// function withoutTime(dateTime) {
//   const date = new Date(dateTime);
//   date.setHours(0, 0, 0, 0);
//   return date;
// }
// module.exports = {
//   name: 'opentalk',
//   description: 'Opentalk',
//   cat: 'komu',
//   async execute(message, args, client) {
//     let userId = message.author.id;
//     let username = message.author.username;
//     if (args[0] === 'remove') {
//       const opentalkUser = await Opentalk.findOne({
//         userId,
//         username,
//         $and: [
//           { date: { $gte: getTimeWeek().firstday.timestamp } },
//           { date: { $lte: getTimeWeek().lastday.timestamp } },
//         ],
//       });

//       await Opentalk.deleteOne({
//         _id: opentalkUser._id,
//       });

//       return message.reply('Remove opentalk this week successfully');
//     } else {
//       const date = Date.now();
//       const opentalkUser = await Opentalk.findOne({
//         userId,
//         username,
//         $and: [
//           { date: { $gte: getTimeWeek().firstday.timestamp } },
//           { date: { $lte: getTimeWeek().lastday.timestamp } },
//         ],
//       });
//       if (opentalkUser) {
//         return message.reply('You have registered to join Opentalk this week');
//       }

//       await new Opentalk({ userId, username, date }).save();
//       message.reply('`✅` Opentalk saved.');
//     }
//   },
// };
