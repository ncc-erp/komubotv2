import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.BWLREACTION)
export class BwlReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  channelId: string;

  @Column({ nullable: true })
  messageId: string;

  @Column({ nullable: true })
  guildId: string;

  @Column({ nullable: true })
  authorId: string;

  @Column({ nullable: true })
  emoji: string;

  @Column({ nullable: true })
  count: number;

  @Column({ type: "decimal" })
  createTimestamp: number;
}
