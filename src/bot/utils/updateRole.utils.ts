import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientConfigService } from "../config/client-config.service";
import axios from "axios";
import { User } from "../models/user.entity";

@Injectable()
export class updateRole {
  constructor(
    @InjectRepository(User)
    private userData: Repository<User>,
    private clientConfig: ClientConfigService
  ) {}
  async updateRoleProject() {
    const userDb = await this.userData
      .createQueryBuilder("users")
      .where('"deactive" IS NOT True')
      .select("users.*")
      .execute();
    const emailArray = userDb.map((user) => user.email);

    for (const email of emailArray) {
      const url = encodeURI(
        `${this.clientConfig.wiki.api_url}${email}@ncc.asia`
      );
      let response;
      try {
        response = await axios.get(url, {
          headers: {
            "X-Secret-Key": process.env.WIKI_API_KEY_SECRET,
          },
        });
      } catch (error) {
        continue;
      }
      if (!response || !response.data.result) {
        await this.userData
          .createQueryBuilder("users")
          .update(User)
          .set({ roles: [] })
          .where('"email" = :email AND deactive IS NOT True');
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
        .createQueryBuilder("users")
        .update(User)
        .set({ roles: rolesRemoveDuplicate as string[] })
        .where('"email" = :email AND deactive IS NOT True');
    }
  }
  async updateRolesDiscord() {}
}
