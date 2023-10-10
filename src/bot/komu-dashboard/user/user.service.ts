import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/bot/models/user.entity";
import { Paging } from "src/bot/utils/commonDto";
import { formatPaging } from "src/bot/utils/formatter";
import { Repository } from "typeorm";
import { getListUser } from "./dto/user.dto";
import { getListUserEdit, getListUserDeactive } from "./dto/editUser.dto";
import { Client } from 'discord.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject('DiscordClient')
    private readonly client: Client,
  ) {
    this.client.login(process.env.TOKEN);
  }

  async findAll(query: getListUser): Promise<Paging<User>> {
    const { email, roles, roles_discord, deactive, page, size, sort, server_deactive } = query;
    const paging = formatPaging(page, size, sort);
    const queryBuilder = await this.userRepository
      .createQueryBuilder("user")
      .take(paging.query.take)
      .skip(paging.query.skip)
      .orderBy("user.username", paging.query.sort as any);

    if (email) {
      queryBuilder.andWhere(`"email" ilike :email OR username ilike :email`, {
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

    if (server_deactive != undefined) {
      queryBuilder.andWhere('"server_deactive" = :server_deactive', {
        server_deactive: server_deactive,
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
          .where(`"userId" = :userId`, {
            userId: userId,
          })
          .execute();
      } else {
        throw new UnauthorizedException(`Please check your userId again`);
      }
    } catch (error) {}
  }
  async editUser(query: getListUserEdit) {
    try {
      const user = await this.userRepository.findOne({
        where: { userId: query?.userId },
      });

      if (user) {
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({
            username:query?.email,
            email: query?.email,
            roles: query?.roles,
            roles_discord: query?.roles_discord,
          })
          .where(`"userId" = :userId`, {
            userId: query?.userId,
          })
          .execute();
      } else {
        throw new UnauthorizedException(`Please check your userId again`);
      }
    } catch (error) {}
  }
  async deactiveUser(query: getListUserDeactive) {
    const { userId } = query;
    try {
      const user = await this.userRepository.findOne({
        where: { userId: userId },
      });
      const guild = this.client.guilds.cache.get(process.env.GUILD_ID_WITH_COMMANDS);
      if (guild) {
        if (!user?.server_deactive) {
          const memberToKick = await guild.members.fetch(userId);
          if (memberToKick) {
              await memberToKick.kick();
              await this.userRepository
                .createQueryBuilder()
                .update(User)
                .set({
                  server_deactive: true,
                })
                .where(`"userId" = :userId`, {
                  userId: userId,
                })
                .execute();  
          } else {
            throw new UnauthorizedException('Người dùng không tồn tại trong máy chủ.');
          }
        } else {
          if (user) {
            const user = await this.client.users.fetch(userId);
            const dmChannel = await user.createDM();
            const invite = await guild.invites.create(process.env.CHANNEL_ID_WELCOME, {
              maxAge: 0,
              maxUses: 1,
              unique: true,
            });
            dmChannel.send(`Mời bạn đến máy chủ? \n ${invite.url}`);
            await this.userRepository
                .createQueryBuilder()
                .update(User)
                .set({
                  server_deactive: false,
                })
                .where(`"userId" = :userId`, {
                  userId: userId,
                })
                .execute();
          } else {
            throw new UnauthorizedException('Người dùng không tồn tại trong máy chủ.');
          }
        }
      } else {
        throw new UnauthorizedException(`Please check your userId again`);
      }
    } catch (error) {}
  }

  async deleteActive(id: string) {
    console.log(id);
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .where(`"userId" = :userId`, {
        userId: id,
      })
      .execute();
  }
}
