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
import { Client, Message, VoiceChannel } from "discord.js";
import { ClientConfigService } from "../config/client-config.service";

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
    private utils: UtilsService,
    private configClient: ClientConfigService
  ) {}

  async audioPlayer(client: Client, message: Message, episode) {
    try {
      const channel = await client.channels.fetch(this.configClient.ncc8Voice);
      const player = createAudioPlayer();

      joinVoiceChannel({
        channelId: channel.id,
        guildId: (channel as VoiceChannel).guild.id,
        adapterCreator: (channel as VoiceChannel).guild.voiceAdapterCreator,
      }).subscribe(player);
      let dataMp3;
      if (!episode) {
        dataMp3 = await this.uploadFileData
          .createQueryBuilder()
          .where('"episode" IS NOT NULL')
          .orderBy('"episode"', "DESC")
          .addOrderBy('"createTimestamp"', "DESC")
          .limit(1)
          .select("*")
          .execute();
      } else {
        // if (checkTimeSchulderNCC8()) {
        //   return message.reply("scheduled playing");
        // }
        dataMp3 = await this.uploadFileData
          .createQueryBuilder()
          .where('"episode" = :episode', { episode })
          .orderBy('"createTimestamp"', "DESC")
          .limit(1)
          .select("*")
          .execute();
        if (dataMp3.length === 0) {
          return message.reply("not released yet");
        }
      }

      const fileNameMp3 = dataMp3.map(async (item) => {
        return await item.fileName;
      });
      const resource = await createAudioResource(
        createReadStream(join("uploads", `${await fileNameMp3[0]}`)),
        {
          inlineVolume: true,
        }
      );
      player.play(resource);

      if (episode && message) {
        message
          .reply(`Go to <#${this.configClient.ncc8Voice}>`)
          .catch(console.error);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
