import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Message, } from "discord.js";
import { CommandLine, CommandLineClass } from "src/bot/base/command.base";
import { sendErrorToDevTest } from "src/bot/untils/komu.until";
import { Repository } from "typeorm";
import user from "user";
import { User } from "../models/user.entity";


@CommandLine({
    name: "test",
    description: "Thong bao",
})
export default class Test implements CommandLineClass {
    constructor(
        @InjectRepository(User)
        private userData: Repository<User>
    ) { }

    async execute(message: Message, args, client,) {
        try {

            this.userData.insert(user)
        } catch (err) {
            console.log(err);
        }
    }
}
