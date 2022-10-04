const bwlData = require("../models/bwlData.js");
const channelData = require("../models/channelData.js");
import downloader from "image-downloader";
import { v4 as uuidv4 } from "uuid";
import { BWL_UtilsServices } from "./bwl_utils.service";

const mediaPath = "./media/attachments/";

export class BWLUtils {
  constructor(private bwl_utilsService: BWL_UtilsServices) {}
  download_image(url, imagePath) {
    downloader
      .image({ url: url, dest: mediaPath + imagePath })
      .then(({ filename }) => {
        console.log("Saved to", filename);
      })
      .catch((err) => console.error(err));
  }
  async bwl(message, client) {
    try {
      const chid = message.channelId;
      const messageId = message.id;
      const guildId = message.guildId;
      const createdTimestamp = message.createdTimestamp;

      const authorId = message.author.id;

      const links = [];
      message.embeds.forEach((embed) => {
        try {
          if (embed.type == "image") {
            console.log("downloading " + embed.url);
            const filename = uuidv4() + "_" + embed.url.split("/").pop();
            this.download_image(embed.url, filename);
            links.push(filename);
          }
        } catch (error) {
          console.error(error);
        }
      });
      message.attachments.forEach((attachment) => {
        try {
          if (attachment.contentType.startsWith("image")) {
            const imageLink = attachment.proxyURL;
            console.log("downloading attachment " + imageLink);
            const filename = uuidv4() + "_" + attachment.name;
            this.download_image(imageLink, filename);
            links.push(filename);
          }
        } catch (error) {
          console.error(error);
        }
      });

      if (links.length > 0) {
        await this.bwl_utilsService
          .addNewBWL(
            chid,
            messageId,
            guildId,
            authorId,
            links,
            createdTimestamp
          )
          .catch(console.error);
      }
      const datachk = await channelData
        .findOne({ id: chid })
        .catch(console.error);
      if (!datachk) {
            await this.bwl_utilsService.addChannelData(
              chid,
              client.channels.cache.get(chid).name,
              client.channels.cache.get(chid).type,
              client.channels.cache.get(chid).nsfw,
              client.channels.cache.get(chid).rawPosition,
              client.channels.cache.get(chid).lastMessageId,
              client.channels.cache.get(chid).rateLimitPerUser
            );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
