import { EmbedBuilder } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import util from "util";

@CommandLine({
  name: "eval",
  description: "Evalue une variable",
})
export class EvalCommand implements CommandLineClass {
  async execute(message, args, client, guildDB) {
    if (!client.config.owners.includes(message.author.id)) return;

    let code = args.join(" ");
    try {
      const ev = eval(code);
      let str = util.inspect(ev, {
        depth: 1,
      });

      str = `${str.replace(
        new RegExp(`${message.client.token}`, "g"),
        "TOKEN"
      )}`;

      if (str.length > 1914) {
        str = str.substr(0, 1914);
        str = str + "...";
      }
      if (code.length > 1914) {
        code = code.substr(0, 1914);
        code = "Bruh, your code is very long.";
      }
      const embed = new EmbedBuilder()
        .setColor(guildDB.color)
        .setDescription(`\`\`\`js\n${clean(str)}\n\`\`\``)
        .addFields("Code" as any, `\`\`\`js\n${code}\n\`\`\``)
        .addFields("Type of:" as any, typeof str)

        .setFooter(message.client.footer);
      message.channel.send({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor(guildDB.color)
        .setDescription(`\`\`\`js\n${error}\n\`\`\``)
        .addFields("Code" as any, `\`\`\`js\n${code}\n\`\`\``)
        .addFields("Type of:" as any, typeof error)

        .setFooter(message.client.footer);
      message.channel.send({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
    }

    function clean(text) {
      if (typeof text === "string") {
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      } else {
        return text;
      }
    }
  }
}
