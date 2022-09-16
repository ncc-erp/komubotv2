import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.WFH)
export class WorkFromHome {
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

  @Column()
  complain: boolean;
  @Column()
  pmconfirm: boolean;
  @Column({ type: "text" })
  status: string;
  @Column({ type: "text" })
  data: string;
  @Column({ type: "text" })
  type: string;
}
