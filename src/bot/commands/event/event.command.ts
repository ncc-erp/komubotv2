import { Client, Message, User as UserDiscord } from "discord.js";
import { CommandLine, CommandLineClass } from "../../base/command.base";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventService } from "./event.serivce";
import { User } from "src/bot/models/user.entity";
import { UtilsService } from "src/bot/utils/utils.service";

const messHelp =
    "```" +
    "*event help" +
    "\n" +
    "*event dd/MM/YYYY HH:mm title [users]" +
    "\n" +
    "*event cancel" +
    "```"

@CommandLine({
    name: "event",
    description: "Create a event",
    cat: "komu"
})
export class EventCommand implements CommandLineClass {
    constructor(
        private komubotrestService: KomubotrestService,
        private readonly utilsService: UtilsService,
        private readonly eventService: EventService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }
    async execute(message: Message, args, client: Client) {
        try {
            let authorId = message.author.id
            const channel_id = message.channel.id;
            let author = await client.users.fetch(authorId)
            let insertUser = [authorId]
            let mess;
            if (!args[0]) {
                let list = await this.eventService.getListEvent(channel_id)
                if (!list || list.length === 0) {
                    return message
                        .reply({
                            content: "`✅` No scheduled meeting.",
                        })
                        .catch((err) => {
                            this.komubotrestService.sendErrorToDevTest(client, authorId, err);
                        });
                } else {
                    for (let i = 0; i <= Math.ceil(list.length / 50); i += 1) {
                        if (list.slice(i * 50, (i + 1) * 50).length === 0) break;
                        mess = "```" +
                            "\n" +
                            (await Promise.all(
                                list
                                    .slice(i * 50, (i + 1) * 50)
                                    .map(async (item) => {
                                        const dateTime = this.utilsService.formatDate(
                                            new Date(Number(item.createdTimestamp))
                                        );
                                        let userMention = await Promise.all(item.users.map(user => {
                                            return this.getDataUserById(user);
                                        }));
                                        const users = userMention.map(user => user.username).join(', ');
                                        return `- ${item.title} ${dateTime} (ID: ${item.id}) with ${users}`;
                                    })
                            )).join("\n") +
                            "```";
                        await message
                            .reply({
                                content: mess,
                            })
                            .catch((err) => {
                                this.komubotrestService.sendErrorToDevTest(
                                    client,
                                    authorId,
                                    err
                                );
                            });
                    }
                }
            }
            else {
                if (args[0] === 'cancel') {
                    if (!args[1]) {
                        return message.channel
                            .send("```" + "*report help" + "```")
                            .catch(console.error);
                    }
                    const id = args[1];
                    const eventId = await this.eventService.cancelEventById(id)
                    if (!eventId) {
                        return message
                            .reply({ content: 'Not found' })
                            .catch((err) => {
                                this.komubotrestService.sendErrorToDevTest(
                                    client,
                                    authorId,
                                    err
                                );
                            });
                    } else {
                        return message
                            .reply({ content: "`✅` Cancel successfully." })
                            .catch((err) => {
                                this.komubotrestService.sendErrorToDevTest(
                                    client,
                                    authorId,
                                    err
                                );
                            });
                    }
                } else if (args[0] === 'help' || !args[3]) {
                    return message.reply({ content: messHelp }).catch((err) => {
                        this.komubotrestService.sendErrorToDevTest(
                            client,
                            authorId,
                            err
                        );
                    });
                } else {
                    const title = args[2]
                    const usersMention = args.slice(3);
                    const datetime = args.slice(0, 2).join(" ");
                    const checkDate = args.slice(0, 1).join(" ");
                    const checkTime = args.slice(1, 2).join(" ");
                    if (usersMention.includes(author.username)) {
                        return message.reply({ content: messHelp }).catch((err) => {
                            this.komubotrestService.sendErrorToDevTest(
                                client,
                                authorId,
                                err
                            );
                        });
                    }
                    const user = await Promise.all(
                        usersMention.map(async (user) => {
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
                                insertUser.push(checkUser.userId)
                                return await client.users.fetch(checkUser.userId)
                            }
                        })
                    )
                    if (user.includes(undefined)) {
                        return message
                            .reply({
                                content: messHelp,
                            })
                            .catch((err) => {
                                this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                            })
                    }
                    if (
                        !/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/.test(
                            checkDate
                        )
                    ) {
                        return message
                            .reply({
                                content: messHelp,
                            })
                            .catch((err) => {
                                this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                            })
                    }
                    if (!/(2[0-3]|[01][0-9]):[0-5][0-9]/.exec(checkTime)) {
                        return message
                            .reply({
                                content: messHelp,
                            })
                            .catch((err) => {
                                this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                            })
                    }
                    const day = datetime.slice(0, 2);
                    const month = datetime.slice(3, 5);
                    const year = datetime.slice(6);
                    const fomat = `${month} / ${day} / ${year}`;
                    const dateObject = new Date(fomat);
                    const timestamp = dateObject.getTime();
                    const createEvent = await this.eventService.saveEvent(title, timestamp, insertUser, channel_id)
                    if (!createEvent) {
                        return message
                            .reply({ content: "This event already exists!", })
                            .catch(err => {
                                this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                            })
                    }
                    await this.NotiCreateEvent(user, author, checkDate, checkTime)
                    return message
                        .reply({ content: "`✅` Event saved.", })
                        .catch(err => {
                            this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                        })
                }
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

    async getDataUserById(id) {
        return await this.userRepository
            .createQueryBuilder()
            .where(`"userId" = :id`, { id })
            .select("*")
            .getRawOne();
    }

    async NotiCreateEvent(userMentions: UserDiscord[], author: UserDiscord, checkDate, checkTime) {
        await Promise.all(
            userMentions.map(async (item) => {
                await item.send(`You have an event with ${author}, ${userMentions} on ${checkDate} in ${checkTime}`)
            })
        )
        await author.send(`You have an event with ${userMentions} on ${checkDate} in ${checkTime} `)
    }
}