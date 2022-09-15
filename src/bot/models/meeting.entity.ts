<<<<<<< HEAD
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
=======
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
>>>>>>> task/entity

import { TABLE } from "../constants/table";

@Entity(TABLE.MEETING)
export class Meeting {
<<<<<<< HEAD
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
=======
  @Column({ type: "text", nullable: true })
  channelId: string;

  @Column({ type: "date", nullable: true })
  createdTimestamp: Date;

  @Column({ type: "text", nullable: true })
  task: string;

  @Column({ type: "text", nullable: true })
  repeat: string;

  @Column({ nullable: true })
  cancel: boolean;

  @Column({ nullable: true })
>>>>>>> task/entity
  reminder: boolean;
}
