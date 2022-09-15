import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.CHECKLIST)
export class CheckList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type : "text"})
  subcategory: string;

  @Column({ type: "text" })
  category: string;
}
