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
        return await this.userData
            .createQueryBuilder('users')
            .where('"userId" = :userId', { userId: authorId })
            .andWhere('"deactive" IS NOT True')
            .orWhere('"roles_discord" = :roles_discord', { roles_discord: ["ADMIN"] })
            .andWhere('"roles_discord" = :roles_discord', { roles_discord: ["HR"] })
            .select('users.*')
            .getMany()
    }
}
