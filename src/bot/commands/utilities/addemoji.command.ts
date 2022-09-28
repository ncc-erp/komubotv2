import * as isURL from "is-url";
import { Message, Client, parseEmoji } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { ExtendersService } from "src/bot/utils/extenders/extenders.service";
@CommandLine({
  name: "addemoji",
  description: "Ajoute un emoji au serveur",
  cat: "utilities",
})
export class AddEmojiCommand implements CommandLineClass {
  constructor(private extendersService: ExtendersService) {}

  async execute(message, args, client, guildDB) {
    let type = "";
    let name = "";
    let emote = args.join(" ").match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi);
    if (emote) {
      emote = args[0];
      type = "emoji";
      name = args
        .join(" ")
        .replace(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi, "")
        .trim()
        .split(" ")[0];
    } else {
      emote = `${args.find((arg) => isURL(arg))}`;
      name = args.find((arg) => arg != emote);
      type = "url";
    }
    let emoji: any = { name: "" };
    let Link;
    if (type == "emoji") {
      emoji = parseEmoji(emote);
      Link = `https://cdn.discordapp.com/emojis/${emoji.id}.${
        emoji.animated ? "gif" : "png"
      }`;
    } else {
      if (!name) {
        return this.extendersService.errorMessageMessage(
          `${
            guildDB.lang === "fr"
              ? "Veuillez fournir un nom pour cet emoji."
              : "Please provide a name for this emoji."
          }`,
          message
        );
      }
      if (name.length > 32) {
        const numberErr = await this.extendersService.translateMessage(
          "NUMBER_ERROR",
          guildDB.lang
        );
        return this.extendersService.errorMessageMessage(
          numberErr.replace("{amount}", "1").replace("{range}", "32"),
          message
        );
      }
      Link = message.attachments.first()
        ? message.attachments.first().url
        : emote;
    }
    try {
      const e = await message.guild.emojis.create(
        `${Link}`,
        `${name || emoji.name}`
      );
      const loadingTest = await this.extendersService.translateMessage(
        "EMOJI_SUCCES",
        guildDB.lang
      );
      return this.extendersService.succesMessageMessage(
        `${loadingTest.replace("{emoji}", e)}`,
        message
      );
    } catch (err) {
      return message.channel.send(
        "`❌` Some errors occured.\n**Reasons:**\n```-This server has reached the emojis limit.\n-Emoji size is too big.\n-The bot doesn't have enought permissions. (Manage Emoji)```"
      );
    }
  }
}
