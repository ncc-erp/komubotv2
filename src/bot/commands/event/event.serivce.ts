import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity } from "src/bot/models/event.entity";
import { Repository } from "typeorm";

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(EventEntity)
        private readonly eventRepository: Repository<EventEntity>,
    ) { }

    async saveEvent(title, createdTimestamp, users) {
        await this.eventRepository.insert({
            title: title,
            createdTimestamp: createdTimestamp,
            users: users
        });
    }

    async cancelEventById(id) {
        return await this.eventRepository
            .createQueryBuilder("meeting")
            .update(EventEntity)
            .set({
                cancel: true,
            })
            .where(`"id" = :id`, { id: id })
            .execute();
    }
}