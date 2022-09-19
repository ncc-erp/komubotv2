import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.MEETING)
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  channelId: string;

  @Column({ type: "date" })
  createdTimestamp: Date;

  @Column({ type: "text" })
  task: string;

  @Column({ type: "date"})
  repeat: Date;

  @Column({ type: "decimal" })
  repeatTime: number;

  @Column({ type: "boolean" })
  cancel: boolean;

  @Column({ type: "boolean" })
  reminder: boolean;
}
