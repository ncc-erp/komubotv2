import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Meeting } from "src/bot/models/meeting.entity";
import { User } from "src/bot/models/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class NotifiService {
    constructor(
        @InjectRepository(User)
        private userData: Repository<User>
    ) { }

    async checkrole(authorId) {
        const users = await this.userData
            .createQueryBuilder("users")
            .where('"userId" = :userId AND ("roles_discord" @> :admin OR "roles_discord" @> :hr)', { userId: authorId, admin: ['ADMIN'], hr: ['HR'] })
            .select("users.*")
            .execute()
        return users;
    }
}
