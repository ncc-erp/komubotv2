import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.CONVERSATION)
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  channelId: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ type: "text" })
  userId: string;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "decimal" })
  createdTimestamp: number;

  @Column({ type: "decimal" })
  updatedTimestamp: number;
}
