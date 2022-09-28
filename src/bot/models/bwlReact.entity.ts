import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.BWLREACTION)
export class BwlReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  channelId: string;

  @Column({ type: "text", nullable: true })
  messageId: string;

  @Column({ type: "text", nullable: true })
  guildId: string;

  @Column({ type: "text", nullable: true })
  authorId: string;

  @Column({ nullable: true })
  emoji: string;

  @Column()
  count: number;

  @Column({ type: "decimal" })
  createTimestamp: number;
}
