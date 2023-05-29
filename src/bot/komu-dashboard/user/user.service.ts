import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/bot/models/user.entity";
import { Paging } from "src/bot/utils/commonDto";
import { formatPaging } from "src/bot/utils/formatter";
import { Repository } from "typeorm";
import { getListUser } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  async findAll(query: getListUser): Promise<Paging<User>> {
    const { email, roles, roles_discord, deactive, page, size, sort } = query;

    const paging = formatPaging(page, size, sort);

    const queryBuilder = await this.userRepository
      .createQueryBuilder("user")
      .take(paging.query.take)
      .skip(paging.query.skip)
      .orderBy(`"user"."createdAt"`, paging.query.sort as any);

    if (email) {
      queryBuilder.andWhere(`"email" ilike :email`, {
        email: `%${email}%`,
      });
    }

    if (roles) {
      queryBuilder.andWhere('("roles" @> :roles)', {
        roles: roles,
      });
    }

    if (roles_discord) {
      queryBuilder.andWhere('("roles_discord" @> :roles_discord)', {
        roles_discord: roles_discord,
      });
    }

    if (deactive != undefined) {
      queryBuilder.andWhere('"deactive" = :deactive', {
        deactive: deactive,
      });
    }

    const [list, total] = await queryBuilder.getManyAndCount();

    return {
      content: list,
      pageable: {
        total,
        ...paging.pageable,
      },
    };
  }

  async toggleActivation(userId: string) {
    try {
      await this.userRepository.find({
        where: { userId: userId },
      });
      const user = await this.userRepository.findOne({
        where: { userId: userId },
      });

      if (user) {
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({
            deactive: !user.deactive,
          })
          .where(`"userId" > :userId`, {
            userId: userId,
          })
          .execute();
      } else {
        throw new UnauthorizedException(`Please check your userId again`);
      }
    } catch (error) {}
  }
}
