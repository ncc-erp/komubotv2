import { EmbedBuilder } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import {KomubotrestController} from '../utils/komubotrest/komubotrest.controller';

import axios from 'axios';

@CommandLine({
    name: 'gem',
    description: 'Gem rank',
})
export class GemrankCommand implements CommandLineClass {
    constructor( private komuborestController : KomubotrestController  ){}
    private messHelp : string = '```' + '*gem rank' + '\n' + '*gem rank username' + '```';
    async execute(message, args, client) {
        try {
            console.log('rank tui la gi do')
            console.log('delay vcl the dm')
          let authorId = message.author.id;
          if (args[0] === 'rank') {
            if (args[1]) {
              let rankUsername;
              try {
                rankUsername = await axios.get(
                  `${client.config.gem.api_url_getMyRank}${args[1]}`
                );
              } catch (error) {
                return message.reply({
                  content: `${this.messHelp}`,
                  ephemeral: true,
                });
              }
    
              const rank = rankUsername.data.outputRankingDTO;
              let mess = `elo: ${rank.elo}, ranking: ${rank.ranking}`;
              const Embed = new EmbedBuilder()
                .setTitle(`${rank.username} ranking`)
                .setColor(0xed4245)
                .setDescription(`${mess}`);
              await message.reply({ embeds: [Embed] }).catch((err) => {
                this.komuborestController.sendErrorToDevTest(client, authorId, err);
              });
            } else {
             const postGemRank = await axios.post(client.config.gem.api_url_getTopRank, {
                page: 0,
                size: 15,
              });
              const rankTop = postGemRank.data.content;
    
              for (let i = 0; i <= Math.ceil(rankTop.length / 50); i += 1) {
                if (rankTop.slice(i * 50, (i + 1) * 50).length === 0) break;
                const mess = rankTop
                  .slice(i * 50, (i + 1) * 50)
                  .map(
                    (list) =>
                      `${list.ranking}: ${list.displayName}, elo: ${list.elo}`
                  )
                  .join('\n');
                const Embed = new EmbedBuilder()
                  .setTitle(`Top ranking`)
                  .setColor(0xed4245)
                  .setDescription(`${mess}`);
                await message.reply({ embeds: [Embed] }).catch(console.error);
              }
            }
          } else {
            return message
              .reply({
                content: `${this.messHelp}`,
                ephemeral: true,
              })
              .catch((err) => {
                this.komuborestController.sendErrorToDevTest(client, authorId, err);
              });
          }
        } catch (err) {
          console.log(err);
        }
      }
}