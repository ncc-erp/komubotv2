import { number } from "@hapi/joi";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.PENATLY)
export class Penalty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  userId: string;

  @Column({ type: "text", nullable: true })
  username: string;

  @Column({ type: "int", nullable: true })
  ammount: number;

  @Column({ type: "text", nullable: true })
  reason: string;

  @Column({ type: "decimal", nullable: true })
  createdTimestamp: number;

  @Column({ type: "boolean", nullable: true })
  isReject: boolean;

  @Column({ type: "text", nullable: true })
  channelId: string;

  @Column({ type: "boolean", nullable: true })
  delete: boolean;
}
