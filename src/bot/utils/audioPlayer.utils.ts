import { checkTimeSchulderNCC8 } from "./date.utils";

const {
  createAudioResource,
  createAudioPlayer,
  joinVoiceChannel,
} = require("@discordjs/voice");
import { createReadStream } from "fs";
import { join } from "path";
import { DataSource } from "typeorm";
import { AudioPlayer } from "../models/uploadFileData";

async function audioPlayer(client, message, episode, dataSource: DataSource) {
  try {
    const uploadFileData = dataSource.getRepository(AudioPlayer);
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
      dataMp3 = await uploadFileData
        .find({

        })
        // .sort({ episode: -1 })
        // .limit(1);
    } else {
      if (checkTimeSchulderNCC8()) {
        return message.reply("scheduled playing");
      }
      dataMp3 = await uploadFileData.find({
        // episode,
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
module.exports = audioPlayer;
