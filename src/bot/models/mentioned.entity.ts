import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.MENTIONED)
export class Mentioned {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  messageId: string;

  @Column({ type: "text", nullable: true })
  authorId: string;

  @Column({ type: "text", nullable: true })
  channelId: string;

  @Column({ type: "text", nullable: true })
  mentionUserId: string;

  @Column({ type: "date", nullable: true })
  createdTimestamp: number;

  @Column({ type: "text", nullable: true })
  noti: boolean;

  @Column({ type: "text", nullable: true })
  confirm: boolean;

  @Column({ type: "text", nullable: true })
  punish: boolean;

  @Column({ default: null, nullable: false })
  reactionTimeStamp: number;
}
