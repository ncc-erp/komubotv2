import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.CHANNEL)
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  type: string;

  @Column({ type: "boolean" })
  nsfw: boolean;

  @Column({ type: "text" })
  rawPosition: number;

  @Column({ type: "text" })
  lastMessageId: string;

  @Column({ type: "decimal" })
  rateLimitPerUser: number;

  @Column({ type: "text" })
  nsparentIdfw: string;
    static find: any;
  static updateOne: any;
}
