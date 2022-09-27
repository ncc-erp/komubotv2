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
  async findCategory(option: string) {
    let checklists = await this.checklistReposistory
      .createQueryBuilder(TABLE.CHECKLIST)
      .where(`${TABLE.CHECKLIST}.category = :category`, { category: option })
      .getMany();
    return checklists;
  }

  async findCheckList(optionSubcategoryId: number) {
    return await this.subcategorysReposistory
      .createQueryBuilder(TABLE.SUBCATEGORYS)
      .where(`${TABLE.SUBCATEGORYS}.checklistId = :checklistId`, {
        checklistId: optionSubcategoryId,
      })
      .getMany();
  }
}
