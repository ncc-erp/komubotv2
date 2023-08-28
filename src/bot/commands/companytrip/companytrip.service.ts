import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { CompanyTrip } from "src/bot/models/companyTrip.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CompanytripService {
  constructor(
    @InjectRepository(CompanyTrip)
    private companyRepository: Repository<CompanyTrip>
  ) {}
  async findUserMention(filter) {
    if (filter.email) {
      return await this.companyRepository
        .createQueryBuilder()
        .andWhere('"year" = :year', { year: filter.year })
        .andWhere('"email" = :email', {
          email: filter.email,
        })
        .select("*")
        .execute();
    } else {
      return await this.companyRepository
        .createQueryBuilder()
        .andWhere('"year" = :year', { year: filter.year })
        .andWhere('"userId" = :userId', {
          userId: filter.userId,
        })
        .select("*")
        .execute();
    }
  }

  async findlistUserRoomMention(room, currentYear) {
    return await this.companyRepository
      .createQueryBuilder()
      .where('"room" = :room', { room: room })
      .andWhere('"year" = :year', { year: currentYear })
      .select("*")
      .execute();
  }

  async findUser(author, currentYear) {
    return await this.companyRepository
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId: author })
      .andWhere(`"year" = :year`, { year: currentYear })
      .select("*")
      .execute();
  }
}
