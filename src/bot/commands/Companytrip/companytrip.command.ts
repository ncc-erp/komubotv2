import { Message , Client, EmbedBuilder} from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { sendErrorToDevTest } from "src/bot/untils/komu.until";
import { CompanytripService } from "./companytrip.service";



@CommandLine({
    name: 'roommate',
    description: 'NCC company trip',
})
export class CompantripCommand implements CommandLineClass {
  constructor( private companytripService : CompanytripService ) {}
    private client : Client;
    private currentYear : string = '2022';
    transArgs(userArgs){
        if (userArgs.includes('<@')) {
          return {
            userId: userArgs.slice(2, userArgs.length - 1),
            year: this.currentYear,
          };
        } else {
          return { email: userArgs, year: this.currentYear };
        }
    };
      async execute(message, args) {
        try {
          let authorId = message.author.id;
          if (args[0]) {
            const filter = this.transArgs(args[0]);
          //  const userMention = await companyTripData.find(filter);
            const userMention = await this.companytripService.findUserMention(filter);
            if (userMention.length === 0) {
              message
                .reply({
                  content:
                    'Người này không có trong danh sách. Hẹn gặp vào NCC COMPANY TRIP 2023',
                  ephemeral: true,
                })
                .catch((err) => {
                  sendErrorToDevTest(this.client, authorId, err);
                });
            }
    
            userMention.map(async (item) => {
              
                const listUserRoomMention = this.companytripService.findlistUserRoomMention(item.room, this.currentYear);
                const roomTripMention = (await listUserRoomMention)
                .map(
                  (room) =>
                    `<@${room.userId}>(${room.email}) văn phòng ${room.office} (${room.role})`
                )
                .join('\n');
                const messMention = userMention
                .map((list) => `Danh sách phòng ${list.room} \n${roomTripMention}`)
                .join('\n');
              const EmbedMention = new EmbedBuilder()
                .setTitle(`Chào mừng bạn đến với NCC COMPANY TRIP 2022`)
                .setColor(0xed4245)
                .setDescription(`${messMention}`);
              await message.reply({ embeds: [EmbedMention] }).catch((err) => {
                sendErrorToDevTest(this.client, authorId, err);
              });
            });
          } else {
            const author = message.author.id;
    
            const user = await this.companytripService.findUser(author, this.currentYear)
    
            if (user.length === 0) {
              message
                .reply({
                  content: 'Hẹn gặp bạn vào NCC COMPANY TRIP 2023',
                  ephemeral: true,
                })
                .catch((err) => {
                  sendErrorToDevTest(this.client, authorId, err);
                });
            }
    
            user.map(async (item) => {
              const listUserRoom = await this.companytripService.findlistUserRoomMention( item.room,this.currentYear);
    
              const roomTrip = listUserRoom
                .map(
                  (room) =>
                    `<@${room.userId}>(${room.email}) văn phòng ${room.office} (${room.role})`
                )
                .join('\n');
                const mess = user
                .map((list) => `Danh sách phòng ${list.room} \n${roomTrip}`)
                .join('\n');
              const Embed = new EmbedBuilder()
                .setTitle(`Chào mừng bạn đến với NCC COMPANY TRIP 2022`)
                .setColor(0xed4245)
                .setDescription(`${mess}`);
              await message.reply({ embeds: [Embed] }).catch((err) => {
                sendErrorToDevTest(this.client, authorId, err);
              });
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
}
