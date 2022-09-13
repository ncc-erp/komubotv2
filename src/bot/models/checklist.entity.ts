import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.CHECKLIST)
export class CheckList {
  @Column()
  id: number;

  @Column()
  subcategory: string;

  @Column({ type: "array" })
  category: string;
}
