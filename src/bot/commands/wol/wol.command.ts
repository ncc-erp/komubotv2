import { InjectRepository } from "@nestjs/typeorm";
import { Client, Message } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { WOL } from "src/bot/models/wol.entity";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { Repository } from "typeorm";

const messHelp =
    "```" +
    "*wol" +
    "\n" +
    "*wol MAC_ADDRESS" +
    "\n" +
    "```"

@CommandLine({
    name: "wol",
    description: "WOL",
    cat: "komu",
})
export class WOLCommand implements CommandLineClass {
    constructor(
        @InjectRepository(WOL)
        private readonly wolRepository: Repository<WOL>,
        private komubotrestService: KomubotrestService,
    ) { }
    async execute(message: Message, args, client: Client) {
        try {
            const authorId = message.author.id;
            const timeStamp = Date.now();
            if (args[0]) {
                const macAddress = args[0];
                const checkUser = await this.wolRepository.findOneBy({ author: authorId })
                if (!checkUser) {
                    {
                        await this.wolRepository.save({
                            author: authorId,
                            wol: macAddress,
                            createdAt: timeStamp
                        })
                        return message
                            .reply({
                                content: "`✅` WOL saved.",
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                } else {
                    await this.wolRepository.createQueryBuilder()
                        .update(WOL)
                        .set({ wol: macAddress })
                        .where('author=:authorId', { authorId })
                        .execute()
                    return message
                        .reply({
                            content: "`✅` WOL saved.",
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            } else {
                const myWOL = await this.wolRepository.findOneBy({ author: authorId })
                console.log(myWOL)
                return message
                    .reply({
                        content: `${myWOL.wol}`,
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }
}
