import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.NOTWORKOUT)
export class NotWorkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  userId: string;

  @Column({ type: "decimal", nullable: true })
  createdTimestamp: number;

  @Column({ type: "decimal", nullable: true })
  sentDate: number;

  @Column({
    type: "numeric",
    precision: 30,
    scale: 1,
    nullable: true,
    default: 0,
  })
  point: number;
}
