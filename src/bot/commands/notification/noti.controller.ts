import axios from "axios";
import { Message, } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { sendErrorToDevTest } from "src/bot/untils/komu.until";
import { NotifiService } from "./noti.service";


@CommandLine({
    name: "thongbao",
    description: "Thong bao",
})
export default class NotificationCommand implements CommandLineClass {
    constructor(
        private notifiService: NotifiService,
    ) { }

    async execute(message: Message, args, client,) {
        try {
            const authorId = message.author.id;
            const noti = args.join(' ');
            const checkRole = await this.notifiService.checkrole(authorId)
            if (!noti || noti == undefined) {
                return message
                    .reply({
                        content: '```please add your text```',
                        // ephemeral: true,
                    })
                    .catch((err) => {
                        sendErrorToDevTest(client, authorId, err);
                    });
            }
            console.log(checkRole)

            if (checkRole.length > 0 || authorId === '871713984670216273') {
                await axios.post(
                    client.config.noti.api_url_quickNews,
                    {
                        content: noti,
                    },
                    {
                        headers: {
                            securityCode: process.env.IMS_KEY_SECRET,
                        },
                    }
                );
            }

        } catch (err) {
            console.log(err);
        }
    }
}
