import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { TABLE } from "../constants/table";
import { User } from "./user.entity";

@Entity(TABLE.WTH)
export class WorkFromHome {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: "user" })
  // userid: User;

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
