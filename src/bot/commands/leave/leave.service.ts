import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Holiday } from "src/bot/models/holiday.entity";
import { Leave } from "src/bot/models/leave.entity";
import { Repository } from "typeorm";

@Injectable()
export class LeaveService {
    constructor(
        @InjectRepository(Leave)
        private leaveReposistory: Repository<Leave>
    ) { }

    async saveLeave(channelId, authorId, minute, reason) {
        this.leaveReposistory.insert({
            channelId: channelId,
            userId: authorId,
            minute,
            reason,

        });
    }
}
