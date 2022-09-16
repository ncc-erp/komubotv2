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
            .createQueryBuilder('orders')
            .where('"id" :=id', { id: authorId })
            .andWhere('"deactive" IS NOT True')
            .orWhere('"role_discord = :role_discord', { role_discord: 'ADMIN' })
            .andWhere('"role_discord = :role_discord', { role_discord: 'HR' })
            .getMany()
    }
}
