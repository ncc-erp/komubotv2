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

    async getListEvent(channel_id) {
        return await this.eventRepository
            .createQueryBuilder("event")
            .where(`"channelId" = :channelId`, { channelId: channel_id })
            .andWhere(`"cancel" IS NOT true`)
            .select(`event.*`)
            .execute();
    }
    async checkEvent(title, users, createdTimestamp, channel_id) {
        return await this.eventRepository.findOne({
            where: {
                title,
                users,
                createdTimestamp,
                channelId: channel_id
            }
        })
    }

    async saveEvent(title, createdTimestamp, users, channel_id) {
        const checkEvent = await this.checkEvent(title, users, createdTimestamp, channel_id)
        if (!checkEvent) {
            return await this.eventRepository.insert({
                title,
                createdTimestamp,
                users,
                channelId: channel_id
            });
        }
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