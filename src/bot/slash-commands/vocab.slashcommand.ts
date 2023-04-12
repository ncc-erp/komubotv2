import { SlashCommandPipe } from "@discord-nestjs/common";
import {
  Command,
  EventParams,
  Handler,
  InteractionEvent,
} from "@discord-nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientEvents, EmbedBuilder, InteractionReplyOptions } from "discord.js";
import { Repository } from "typeorm";
import { Keep } from "../models/keep.entity";
import { VocabDto } from "./dto/vocab.dto";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";

@Command({
  name: "vocab",
  description: "Vocabulary search",
})
export class VocabSlashCommand {
  constructor(
    @InjectRepository(Keep)
    private keepData: Repository<Keep>,
    private httpService: HttpService
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: VocabDto,
    @EventParams() args: ClientEvents['interactionCreate'],
  ): Promise<InteractionReplyOptions> {
    try {
      const word = dto.word;
      const { data } = await firstValueFrom(
        this.httpService.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        )
      ).catch((err) => {
        console.log("error", err);
        return {
          data: undefined
        };
      });

      if (data == undefined || data.length == undefined || data.length == 0) {
        return {
          content: `Nothing match... **${word}**.`,
          ephemeral: true,
        };
      }

      const botTexts = [];
      const botExamples = [];

      let d;
      for (d = 0; d < data.length; d++) {
        let i, j, k;
        for (i = 0; i < data[d].phonetics.length; i++) {
          if (data[d].phonetics[i].audio !== undefined) {
            botTexts.push(
              data[d].phonetics[i].text +
                " (https:" +
                data[d].phonetics[i].audio +
                ")"
            );
          } else {
            botTexts.push(data[d].phonetics[i].text);
          }
        }

        for (i = 0; i < data[0].meanings.length; i++) {
          let meaning = data[0].meanings[i].partOfSpeech + "\n";
          for (j = 0; j < data[0].meanings[i].definitions.length; j++) {
            meaning +=
              "\t" + data[0].meanings[i].definitions[j].definition + "\n";
            meaning += "\t" + data[0].meanings[i].definitions[j].example + "\n";
            meaning += "\n\t *Synonyms* \n";
            for (
              k = 0;
              k < data[0].meanings[i].definitions[j].synonyms.length;
              k++
            ) {
              meaning +=
                "\t\t" + data[0].meanings[i].definitions[j].synonyms[k] + "\n";
            }
            botExamples.push(meaning);
          }
        }
      }

      const embed = new EmbedBuilder()
        .setColor("#EFFF00")
        .setTitle(word)
        .addFields(
          { name: "phonetics", value: botTexts.join("\n"), inline: false },
          {
            name: "meanings",
            value: botExamples.join("\n").substring(0, 1024),
            inline: false,
          }
        );
      return { embeds: [embed], ephemeral: true };
    } catch (error) {
      console.log(error, "error");
    }
  }
}
