import { Column, Entity } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.CONVERSATION)
export class Conversation {
  @Column({ nullable: false })
  channelId: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ type: "array" })
  userId: string;

  @Column({ type: "array" })
  email: string;

  @Column({ type: "decimal" })
  createdTimestamp: number;

  @Column({ type: "decimal" })
  updatedTimestamp: number;
}
