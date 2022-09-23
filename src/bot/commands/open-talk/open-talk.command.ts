// import { InjectRepository } from "@nestjs/typeorm";
// import { Message } from "discord.js";
// import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
// import { Opentalk } from "src/bot/models/opentalk.entity";
// import { Repository } from "typeorm";
// import { OpenTalkService } from "./open-talk.service";

// @CommandLine({
//   name: "opentalk",
//   description: "Opentalk",
// })
// export class OpenTalkCommand implements CommandLineClass {
//   constructor(
//     @InjectRepository(Opentalk)
//     private readonly openTalkRepository: Repository<Opentalk>,
//     private readonly openTalkService: OpenTalkService
//   ) {}
//   async execute(message: Message, args) {
//     let userId = message.author.id;
//     let username = message.author.username;
//     if (args[0] === "remove") {
//       const opentalkUser = await this.openTalkService.getUserOpenTalk(
//         userId,
//         username
//       );

//       await this.openTalkService.deleteUserOpenTalk(opentalkUser[0].id);
//       return message.reply("Remove opentalk this week successfully");
//     } else {
//       const createdTimestamp = Date.now();
//       const opentalkUser = await this.openTalkService.getUserOpenTalk(
//         userId,
//         username
//       );

//       if (opentalkUser.length > 0) {
//         return message.reply("You have registered to join Opentalk this week");
//       } else {
//         await this.openTalkRepository.insert({
//           userId,
//           username,
//           createdTimestamp,
//         });
//         message.reply("`✅` Opentalk saved.");
//       }
//     }
//   }
// }
