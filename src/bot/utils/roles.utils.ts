import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { firstValueFrom } from "rxjs";
import { Repository } from "typeorm";
import { ClientConfigService } from "../config/client-config.service";
import { User } from "../models/user.entity";

@Injectable()
export class UpdateRole {
  constructor(
    @InjectRepository(User)
    private userData: Repository<User>,
    private readonly http: HttpService,
    private clientConfigService: ClientConfigService
  ) {}
  async updateRoleProject(client) {
    const userDb = await this.userData
      .createQueryBuilder("users")
      .where('"deactive" IS NOT True')
      .select("users.*")
      .execute();
    const emailArray = userDb.map((user) => user.email);
    for (const email of emailArray) {
      const url = encodeURI(
        `${this.clientConfigService.wiki.api_url}${email}@ncc.asia`
      );
      let response;
      try {
        response = await firstValueFrom(
          this.http
            .get(url, {
              headers: {
                "X-Secret-Key": process.env.WIKI_API_KEY_SECRET,
              },
            })
            .pipe((res) => res)
        );
      } catch (error) {
        continue;
      }
      if (!response || !response.data.result) {
        await this.userData
          .createQueryBuilder()
          .update(User)
          .set({ roles: [] })
          .where('"email" = :email', { email: email })
          .andWhere('"deactive" IS NOT True')
          .execute();
        continue;
      }

      let roles;
      if (
        Array.isArray(response.data.result.projectDtos) &&
        response.data.result.projectDtos.length !== 0
      ) {
        roles = response.data.result.projectDtos.map(
          (project) => project.projectRole
        );
      } else {
        roles = [];
      }
      const rolesRemoveDuplicate = [...new Set(roles)];
      await this.userData
        .createQueryBuilder()
        .update(User)
        .set({ roles: rolesRemoveDuplicate as string[] })
        .where('"email" = :email', { email: email })
        .andWhere('"deactive" IS NOT True')
        .execute();
      continue;
    }
  }
  async updateRoleDiscord(client) {
    const user = await this.userData
      .createQueryBuilder("users")
      .where('"deactive" IS NOT True')
      .select("users.*")
      .execute();
    const userids = user.map((item) => item.userId);

    let guild = await client.guilds.fetch("921239248991055882");

    for (let userid of userids) {
      let member;
      try {
        member = await guild.members.fetch(userid);
      } catch (error) {
        continue;
      }
      const roles = member.roles.cache
        .filter((roles) => roles.id !== guild.id)
        .map((role) => role.name);
      await this.userData
        .createQueryBuilder()
        .update(User)
        .set({ roles_discord: roles as string[] })
        .where('"userId" = :userId', { userId: userid })
        .andWhere('"deactive" IS NOT True')
        .execute();
    }
  }
}
