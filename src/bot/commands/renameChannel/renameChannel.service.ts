import { Injectable } from "@nestjs/common";
import { Client } from "discord.js";

@Injectable()
export class RenameChannelService {
  constructor() {}

  async checkNameChannel(channelName) {
    const isUpperCase = /[A-Z]/.test(channelName);
    const isCharacter = /[_]/.test(channelName);
    const wordCount = channelName.split(" ").length;
    if (wordCount > 1 || isUpperCase || isCharacter) {
      let newName = channelName.toLowerCase();
      newName = newName.replace(/[_\s]/g, "-");
      return newName;
    } else return false;
  }

  async renameChannel(channel: any, client: Client) {
    const renameChannelText = await this.checkNameChannel(channel.name);
    if (!renameChannelText) {
      return;
    } else {
      const channelOriginalName = await client.channels
        .fetch(channel.id)
        .catch((err) => console.log(err));
      if (channelOriginalName) {
        await (channelOriginalName as any).setName(`${renameChannelText}`);
      }
    }
  }
}
