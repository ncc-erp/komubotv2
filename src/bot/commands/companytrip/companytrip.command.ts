import { Client, EmbedBuilder, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { CompanytripService } from "./companytrip.service";

@CommandLine({
  name: "roommate",
  description: "NCC company trip",
  cat: "komu",
})
export class CompantripCommand implements CommandLineClass {
  constructor(
    private companytripService: CompanytripService,
    private komubotrestService: KomubotrestService
  ) {}
  private client: Client;
  private currentYear: string = "2022";
  transArgs(userArgs) {
    if (userArgs.includes("<@")) {
      return {
        userId: userArgs.slice(2, userArgs.length - 1),
        year: this.currentYear,
      };
    } else {
      return { email: userArgs, year: this.currentYear };
    }
  }
  async execute(message: Message, args) {
    try {
      let authorId = message.author.id;
      if (args[0]) {
        const filter = this.transArgs(args[0]);
        //  const userMention = await companyTripData.find(filter);
        const userMention = await this.companytripService.findUserMention(
          filter
        );
        if (userMention.length === 0) {
          message
            .reply({
              content:
                "Người này không có trong danh sách. Hẹn gặp vào NCC COMPANY TRIP 2023",
              // ephemeral: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(
                this.client,
                authorId,
                err
              );
            });
        }

        userMention.map(async (item) => {
          const listUserRoomMention =
            await this.companytripService.findlistUserRoomMention(
              item.room,
              this.currentYear
            );
          const roomTripMention = await listUserRoomMention
            .map(
              (room) =>
                `<@${room.userId}>(${room.email}) văn phòng ${room.office} (${room.role})`
            )
            .join("\n");
          const messMention = userMention
            .map((list) => `Danh sách phòng ${list.room} \n${roomTripMention}`)
            .join("\n");
          const EmbedMention = new EmbedBuilder()
            .setTitle(`Chào mừng bạn đến với NCC COMPANY TRIP 2022`)
            .setColor(0xed4245)
            .setDescription(`${messMention}`);
          await message.reply({ embeds: [EmbedMention] }).catch((err) => {
            this.komubotrestService.sendErrorToDevTest(
              this.client,
              authorId,
              err
            );
          });
        });
      } else {
        const author = message.author.id;

        const user = await this.companytripService.findUser(
          author,
          this.currentYear
        );

        if (user.length === 0) {
          message
            .reply({
              content: "Hẹn gặp bạn vào NCC COMPANY TRIP 2023",
              // ephemeral: true,
            })
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(
                this.client,
                authorId,
                err
              );
            });
        }

        user.map(async (item) => {
          const listUserRoom =
            await this.companytripService.findlistUserRoomMention(
              item.room,
              this.currentYear
            );

          const roomTrip = listUserRoom
            .map(
              (room) =>
                `<@${room.userId}>(${room.email}) văn phòng ${room.office} (${room.role})`
            )
            .join("\n");
          const mess = user
            .map((list) => `Danh sách phòng ${list.room} \n${roomTrip}`)
            .join("\n");
          const Embed = new EmbedBuilder()
            .setTitle(`Chào mừng bạn đến với NCC COMPANY TRIP 2022`)
            .setColor(0xed4245)
            .setDescription(`${mess}`);
          await message.reply({ embeds: [Embed] }).catch((err) => {
            this.komubotrestService.sendErrorToDevTest(
              this.client,
              authorId,
              err
            );
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
