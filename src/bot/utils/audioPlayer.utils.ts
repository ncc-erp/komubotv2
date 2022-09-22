import {
  createAudioPlayer,
  joinVoiceChannel,
  createAudioResource,
} from "@discordjs/voice";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Uploadfile } from "../models/uploadFile.entity";
import { UtilsService } from "./utils.service";
import { createReadStream } from "fs";
import { join } from "path";
import { Injectable } from "@nestjs/common";

function setTime(date, hours, minute, second, msValue) {
  return date.setHours(hours, minute, second, msValue);
}
function checkTimeSchulderNCC8() {
  let result = false;
  const time = new Date();
  const cur = new Date();
  const timezone = time.getTimezoneOffset() / -60;
  const day = time.getDay();
  const fisrtTime = new Date(setTime(time, 6 + timezone, 15, 0, 0)).getTime();
  const lastTime = new Date(setTime(time, 7 + timezone, 15, 0, 0)).getTime();
  if (cur.getTime() >= fisrtTime && cur.getTime() <= lastTime && day == 5) {
    result = true;
  }
  return result;
}
@Injectable()
export class AudioPlayer {
  constructor(
    @InjectRepository(Uploadfile)
    private uploadFileData: Repository<Uploadfile>,
    private utils: UtilsService
  ) {}

  async audioPlayer(client, message, episode) {
    try {
      const channel = await client.channels.fetch("921323636491710504");
      const player = createAudioPlayer();

      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      }).subscribe(player);
      let dataMp3;
      if (!episode) {
        dataMp3 = await this.uploadFileData
          .createQueryBuilder("uploadFile.*")
          .where('"episode" IS EXISTS')
          .orderBy("episode", "DESC")
          .limit(1);
      } else {
        if (checkTimeSchulderNCC8()) {
          return message.reply("scheduled playing");
        }
        dataMp3 = await this.uploadFileData.findBy({
          episode: episode,
        });
        if (dataMp3.length === 0) {
          return message.reply("not released yet");
        }
      }

      const fileNameMp3 = dataMp3.map((item) => {
        return item.fileName;
      });

      const resource = await createAudioResource(
        createReadStream(join("uploads", `${fileNameMp3[0]}`)),
        {
          inlineVolume: true,
        }
      );

      player.play(resource);

      if (episode && message) {
        message.channel
          .send(`@here go to <#921323636491710504>`)
          .catch(console.error);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
