import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { Dynamic } from "src/bot/models/dynamic.entity";
import { Repository } from "typeorm";

@Injectable()
export class DynamicService {
  constructor(
    @InjectRepository(Dynamic) private dynamicRepository: Repository<Dynamic>
  ) {}
  async saveDynamic(userId: string, command: string, output: string) {
    await this.dynamicRepository
      .createQueryBuilder(TABLE.DYNAMIC)
      .insert()
      .into(Dynamic)
      .values({
        userId: userId,
        command: command,
        output: output,
      })
      .execute();
  }
  async getDynamic(command) {
    return await this.dynamicRepository
      .createQueryBuilder()
      .where(`"command" = :command`, { command: command })
      .select("*")
      .execute();
  }
  async getAll(): Promise<Dynamic[]> {
    return await this.dynamicRepository.find({ select: ["command"] });
  }
}
