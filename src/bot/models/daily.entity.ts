import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.DAILY)
export class Daily {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  userid: string;

  @Column({})
  email: string;

  @Column()
  daily: string;

  @Column({ type: "decimal", nullable: true })
  createdAt: number;

  @Column()
  channelid: string;
}
