import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.ORDER)
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  userId: string;

  @Column({ type: "text" })
  channelId: string;

  @Column({ type: "text" })
  menu: string;

  @Column({ type: "text" })
  username: string;

  @Column({ type: "boolean" })
  isCancel: boolean;

  @Column({ type: "decimal" })
  createdTimestamp: number;
}