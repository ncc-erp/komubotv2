import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImportantSMS } from "src/bot/models/importantSMS.entity";
import { Repository } from "typeorm";

@Injectable()
export class ImportantSMSService {
    constructor(
        @InjectRepository(ImportantSMS)
        private readonly importantSMS: Repository<ImportantSMS>
    ) { }

    async saveSms(channelID, sms, users, timeStamp, reminder) {
        await this.importantSMS.insert({
            message: sms,
            users: users,
            channelId: channelID,
            reminder: reminder,
            createdTimestamp: timeStamp
        });
    }

    async listImportantSMS(userId) {
        const list = await this.importantSMS.createQueryBuilder()
            .where(":userId = ANY(users)", { userId })
            .getMany()
        return list
    }

    async deleteSMS(userId: string, id, messHelp) {
        try {
            const checkSms = await this.importantSMS.createQueryBuilder()
                .where(":userId = ANY(users)", { userId })
                .andWhere('id=:id', { id })
                .getOne();
            if (!checkSms) {
                return `Not found SMSQT`
            }
            checkSms.users = checkSms.users.filter((username) => username !== userId)
            if (checkSms.users.length > 0) {
                await this.importantSMS.save(checkSms)
            } else {
                await this.importantSMS.delete(id)
            }
            return "`✅` SMS deleted."
        } catch (err) {
            return messHelp
        }

    }
}