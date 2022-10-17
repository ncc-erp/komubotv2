import { TransformPipe } from "@discord-nestjs/common";
import {
  Command,
  DiscordTransformedCommand,
  InjectDiscordClient,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from "@discord-nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { EmbedBuilder, Message } from "discord.js";
import { Repository } from "typeorm";
import { KeepDto } from "./dto/keep.dto";
import { Keep } from "../models/keep.entity";
import { VocabDto } from "./dto/vocab.dto";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";

@Command({
  name: "vocab",
  description: "Vocabulary search",
})
@UsePipes(TransformPipe)
export class VocabSlashCommand implements DiscordTransformedCommand<VocabDto> {
  constructor(
    @InjectRepository(Keep)
    private keepData: Repository<Keep>,
    private httpService: HttpService
  ) {}

  async handler(
    @Payload() dto: VocabDto,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<any> {
    try {
      const word = interaction.options.get("word").value as string;
      const { data } = await firstValueFrom(
        this.httpService.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        )
      ).catch((err) => {
        console.log("error", err);
        interaction.reply({
          content: `Nothing match... **${word}**.`,
          ephemeral: true,
        });
        return { data: "There was an error!" };
      });

      if (data == undefined || data.length == undefined || data.length == 0) {
        interaction.reply({
          content: `Nothing match... **${word}**.`,
          ephemeral: true,
        });
        return;
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
      interaction
        .reply({ embeds: [embed], ephemeral: true })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error, "error");
    }
  }
}
