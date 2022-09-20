import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.REMIND)
export class Remind {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: false })
  channelId: string;

  @Column({ type: "text", nullable: false })
  mentionUserId: string;

  @Column({ type: "text", nullable: false })
  authorId: string;

  @Column({ type: "text", nullable: false })
  content: string;

  @Column({ type: "boolean", nullable: true })
  cancel: boolean;

  @Column({ type: "decimal", nullable: true })
  createdTimestamp: number;
}