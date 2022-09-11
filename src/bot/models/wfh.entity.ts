import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.WTH)
export class Wth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  userid: string;

  @Column({ type: "text" })
  messageid: string;

  @Column({ type: "text" })
  wfhMsg: string;

  @Column({ type: "date" })
  createdAt: Date;

  @Column({ type: "boolean" })
  complain: boolean;

  @Column({ type: "boolean" })
  pmconfirm: boolean;

  @Column({ type: "text" })
  status: string;

  @Column({ type: "text" })
  data: string;

  @Column({ type: "text" })
  type: string;
}
