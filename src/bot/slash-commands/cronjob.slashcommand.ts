// import {
//     Command,
//     EventParams,
//     Handler,
//     InteractionEvent,
//     On
//   } from "@discord-nestjs/core";
//   import {
//     ChannelManager,
//     Client,
//     ClientEvents,
//     CommandInteraction,
//     Interaction,
//     Message
//   } from "discord.js";
// import { SlashCommandPipe } from "@discord-nestjs/common";
// import { CronjobDto } from "./dto/cronjob.dto";


  // @Command({
  //   name: "cronjob",
  //   description: "cronjob message",
  // })
  // export class CronjobSlashCommand {

    // @Handler()
    // async handler(
    //   @InteractionEvent(SlashCommandPipe) dto: CronjobDto,
    //   @EventParams() args: ClientEvents["interactionCreate"]
    // ): Promise<any> {
    //   try {
    //     const timeout = dto.timeout;
    //     const messageUser = dto.message;
    //     // const interaction = args.at(0) as any;
    //     // this.onMessage(timeout, messageUser);
    //     return { content: "`✅` create message cronjob success!.", ephemeral: true };
    //   } catch (error) {
    //     console.log("error cronjob: " + error);
    //     return { content: "create message cronjob failed!.", ephemeral: true };
    //   }
    // } 

  //   @On('messageCreate')
  // async onMessage(message: Message): Promise<void> {
    // if (!message.author.bot) {
    //   await message.reply("I'm watching you");
    // }
    // args.at[0].reply({ content: `${dto.message}`, ephemeral: true });

      // setTimeout(() => {
      //   try {
      //     // message.reply(`${dto.message}`);
      //     //  return { content: `${messageUser}`, ephemeral: true };
      //     // await interaction.guild.members.fetch().reply(messageUser);
      //   } catch (error) {
      //     console.error("Error sending cronjob message:", error);
      //   }
      // }, Number(dto.timeout));
  // }
// }
  