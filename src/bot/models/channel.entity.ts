import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.CHANNEL)
export class Channel {
  @PrimaryColumn()
  channelId: string;

  @Column({ type: "text", nullable: true })
  name: string;

  @Column({ type: "text", nullable: true })
  type: string;

  @Column({ type: "boolean" })
  nsfw: boolean;

  @Column({ type: "text", nullable: true })
  rawPosition: number;

  @Column({ type: "text", nullable: true })
  lastMessageId: string;

  @Column({ type: "decimal", nullable: true })
  rateLimitPerUser: number;

  @Column({ type: "text", nullable: true })
  parentId: string;
}
