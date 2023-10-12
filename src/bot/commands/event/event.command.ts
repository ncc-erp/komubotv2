import { Client, Message, User, User as UserDiscord } from "discord.js";
import { CommandLine, CommandLineClass } from "../../base/command.base";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventService } from "./event.serivce";

const messHelp =
    "```" +
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
        private readonly eventService: EventService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }
    async execute(message: Message, args, client: Client) {
        try {
            let authorId = message.author.id
            let author = await client.users.fetch(authorId)
            let insertUser = [authorId]
            if (!args[0]) {
                return message
                    .reply({
                        content: messHelp,
                    })
                    .catch((err) => {
                        this.komubotrestService.sendErrorToDevTest(client, authorId, err)
                    })
            } else {
                const title = args[2]
                const usersMention = args.slice(3);
                const datetime = args.slice(0, 2).join(" ");
                const checkDate = args.slice(0, 1).join(" ");
                const checkTime = args.slice(1, 2).join(" ");

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
                            throw new Error(`User ${user} not found`)
                        } else {
                            insertUser.push(checkUser.userId)
                            return await client.users.fetch(checkUser.userId)
                        }
                    })
                )
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
                await this.eventService.saveEvent(title, timestamp, insertUser)
                await this.NotiCreateEvent(user, author)
                return message
                    .reply({ content: "`✅` Event saved.", })
                    .catch(err => {
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

    async NotiCreateEvent(userMentions: UserDiscord[], author: UserDiscord) {
        await Promise.all(
            userMentions.map(async (item) => {
                await item.send(`You have a event with ${author} and ${userMentions} `)
            })
        )
        await author.send(`You have a event with ${userMentions} `)
    }
}