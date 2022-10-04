import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { EmbedBuilder } from "discord.js";
import { ExtendersService } from "src/bot/utils/extenders/extenders.service";
import { ClientConfigService } from "src/bot/config/client-config.service";

@CommandLine({
  name: "botinfo",
  description: "create a poll",
  cat: "utilities",
})
export class BotInfo implements CommandLineClass {
  constructor(
    private extendersService: ExtendersService,
    private readonly clientConfigService: ClientConfigService
  ) {}
  async execute(message, args, client, guildDB) {
    //   const questions = questionData
    //     .createQueryBuilder("questions")
    //     .where('"id" NOT IN :questionAnswerId', {
    //       questionAnswerId: questionAnswerId,
    //     })
    //     .andWhere('"role" = :roleRandom', { roleRandom: roleRandom })
    //     .andWhere('"isVerify" = True')
    //     .andWhere('"accept" = True')
    //     .select("*")
    //     .getMany();
    //   const b = questions
    //     .createQueryBuilder("questions")
    //     .where('"title" IS EXISTS')
    //     .andWhere('length("title") < :strLenCp', { strLenCp: 236 })
    //     .select("*")
    //     .getMany();
  }
}
