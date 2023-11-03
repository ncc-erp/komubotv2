import { InjectRepository } from "@nestjs/typeorm";
import { Client, EmbedBuilder, Message, TextChannel, User as UserDiscord } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { Repository } from "typeorm";
import { ImportantSMSService } from "./important.service";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { User } from "src/bot/models/user.entity";
const messHelp =
    "```" +
    "*sms list" +
    "\n" +
    "*sms qt" +
    "\n" +
    "*sms kc" +
    "\n" +
    "*sms qt [user]" +
    "\n" +
    "*sms kc [user]" +
    "\n" +
    "*sms delete id" +
    "```"

@CommandLine({
    name: 'sms',
    description: 'Create a important message',
    cat: 'komu'
})

export class ImportantSMSCommand implements CommandLineClass {
    constructor(
        private komubotrestService: KomubotrestService,
        private importantsmsService: ImportantSMSService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {

    }
    async execute(message: Message, args, client: Client) {
        try {
            const authorId = message.author.id;
            let allUser = [authorId];
            const timeStamp = Date.now();
            let reminder = 0;

            if (args[0]) {

                if (args[0] === 'list') {
                    const list = await this.importantsmsService.listImportantSMS(authorId)
                    const sendlist = await Promise.all(
                        list.map(async (item) => {
                            const channel = await client.channels.fetch(item.channelId);
                            const sms = await (channel as TextChannel).messages.fetch(item.message)
                            const mess = `${item.id}: ${sms.content}`
                            return "\n" + mess
                        })
                    )
                    return await this.sendMessage(client, allUser, sendlist)

                } else if (args[0] === 'delete') {

                    if (args[1]) {
                        const id = args[1]
                        const delelteSms = await this.importantsmsService.deleteSMS(authorId, id, messHelp)
                        return message
                            .reply({
                                content: `${delelteSms}`,
                            })
                            .catch((err) => {
                                this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                            })

                    } else {

                        return message
                            .reply({
                                content: `${messHelp}`,
                            })
                            .catch((err) => {
                                this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                            })
                    }

                } else if (args[0] == 'qt' || args[0] == 'kc') {

                    reminder = (args[0] == 'qt') ? 5 : 0
                    if (args[1]) {
                        const userTag = args.slice(1)
                        const user = await Promise.all(
                            userTag.map(async (user) => {
                                const checkUser = await this.getDataUser(user);
                                if (!checkUser) {
                                    message
                                        .reply({
                                            content: `User ${user} not found`,
                                        })
                                        .catch((err) => {
                                            this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                                        })
                                } else {
                                    return (allUser.push(checkUser.userId))
                                }
                            }))
                        if (user.includes(undefined)) {
                            return message
                                .reply({
                                    content: messHelp,
                                })
                                .catch((err) => {
                                    this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                                })
                        }
                    }

                    if (message.reference == null) {
                        return message
                            .reply({
                                content: messHelp,
                            })
                            .catch((err) => {
                                this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                            })
                    }

                    const smsQT = await message.reference.messageId;
                    const channelID = await message.reference.channelId;
                    const channel = await client.channels.fetch(channelID);
                    const sms = await (channel as TextChannel).messages.fetch(smsQT)
                    await this.importantsmsService.saveSms(channelID, smsQT, allUser, timeStamp, reminder)
                    await this.sendMessage(client, allUser, sms)
                    return message
                        .reply({ content: "`✅` SMS saved.", })
                        .catch(err => {
                            this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                        })

                } else {
                    return message
                        .reply({
                            content: messHelp,
                        })
                        .catch((err) => {
                            this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                        })
                }

            } else {
                return message
                    .reply({
                        content: messHelp,
                    })
                    .catch((err) => {
                        this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                    })
            }

        } catch (error) {
            console.log(error)
        }
    }

    async getDataUser(email) {
        return await this.userRepository
            .createQueryBuilder()
            .where(`"email" = :email`, { email: email })
            .orWhere(`"username" = :username`, { username: email })
            .select("*")
            .getRawOne();
    }

    async sendMessage(client: Client, user, message) {
        const embeds = new EmbedBuilder()
            .setTitle('IMPORTANT MESSAGE')
            .setDescription("```" + `${message}` + "```")
            .setColor("Random")
        Promise.all(
            user.map(async (userId) => {
                const user = await client.users.fetch(userId)
                await user.send({
                    embeds: [embeds]
                })
            })
        )
    }
}
