import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Message, EmbedBuilder } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { Uploadfile } from "src/bot/models/uploadFile.entity";
import { AudioPlayer } from "src/bot/utils/audioPlayer.utils";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { UtilsService } from "src/bot/utils/utils.service";
import { Repository } from "typeorm";

@CommandLine({
  name: "ncc8",
  description: "Ncc8",
  cat: 'komu',
})
export default class Ncc8Command implements CommandLineClass {
  constructor(
    @InjectRepository(Uploadfile)
    private uploadFileData: Repository<Uploadfile>,
    private utils: UtilsService,
    private audioPlayer: AudioPlayer,  private komubotrestService : KomubotrestService,
  ) {}

  async execute(message: Message, args, client) {
    try {
      let authorId = message.author.id;
      if (args[0] === "playlist") {
        let dataMp3 = await this.uploadFileData.find({
          order: {
            episode: "DESC",
          },
        });
        if (!dataMp3) {
          return;
        } else if (Array.isArray(dataMp3) && dataMp3.length === 0) {
          let mess = "```" + "Không có NCC nào" + "```";
          return message.reply(mess).catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
        } else {
          for (let i = 0; i <= Math.ceil(dataMp3.length / 50); i += 1) {
            if (dataMp3.slice(i * 50, (i + 1) * 50).length === 0) break;
            let mess = dataMp3
              .slice(i * 50, (i + 1) * 50)
              .filter((item) => item.episode)
              .map((list) => `NCC8 số ${list.episode}`)
              .join("\n");
            const Embed = new EmbedBuilder()
              .setTitle("Danh sách NCC8")
              .setColor("Red")
              .setDescription(`${mess}`);
            await message.reply({ embeds: [Embed] }).catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
          }
        }
      } else if (args[0] === "play") {
        if (args[0] !== "play" || !args[1]) {
          return message
            .reply("```" + "*ncc8 play episode" + "```")
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
        }
        if (!this.utils.checkNumber(args[1])) {
          return message
            .reply("```" + "episode must be number" + "```")
            .catch((err) => {
              this.komubotrestService.sendErrorToDevTest(client, authorId, err);
            });
        }
        await this.audioPlayer.audioPlayer(client, message, args[1]);
      } else {
        return message
          .reply("```" + "*ncc8 play episode" + "```")
          .catch((err) => {
            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
