import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.DATING)
export class Dating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  channelId: string;

  @Column({ type: "text", nullable: false })
  userId: string;

  @Column({ type: "text", nullable: false })
  email: string;

  @Column({ nullable: false })
  sex: number;

  @Column({ nullable: false })
  loop: number;

  @Column({ type: "decimal" })
  createdTimestamp: number;
}
