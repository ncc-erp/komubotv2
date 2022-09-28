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
    private checklistReposistory: Repository<CheckList>,
    @InjectRepository(Subcategorys)
    private subcategorysReposistory: Repository<Subcategorys>
  ) {}
  async findCategory(option) {
    let checklists = await this.checklistReposistory
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
    return await this.subcategorysReposistory
      .createQueryBuilder()
      .where(`"checklistId" = :checklistId`, {
        checklistId: optionSubcategoryId,
      })
      .select("*")
      .execute();
  }
}
