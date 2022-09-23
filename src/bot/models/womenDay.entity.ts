import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.WOMENDAY)
export class WomenDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  userid: string;

  @Column({ type: "boolean" })
  win: boolean;

  @Column({ type: "boolean" })
  gift: boolean;
}
