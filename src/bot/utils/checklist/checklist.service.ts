import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TABLE } from "src/bot/constants/table";
import { CheckList } from "src/bot/models/checklist.entity";
import { Subcategorys } from "src/bot/models/subcategoryData.entity";
import { Repository } from "typeorm";

@Injectable()
export class CheckListService {
  constructor(
    @InjectRepository(CheckList)
    private checklistRepository: Repository<CheckList>,
    @InjectRepository(Subcategorys)
    private subcategorysRepository: Repository<Subcategorys>
  ) {}
  async findCategory(option) {
    let checklists = await this.checklistRepository
      .createQueryBuilder()
      .where("category = :category", {
        category: [option],
      })
      // .where(`"category" = :category`, { category: option })
      .select("*")
      .execute();
    return checklists;
  }

  async findCheckList(optionSubcategoryId: number) {
    return await this.subcategorysRepository
      .createQueryBuilder()
      .where(`"id" = :id`, {
        id: optionSubcategoryId,
      })
      .select("*")
      .execute();
  }
}
