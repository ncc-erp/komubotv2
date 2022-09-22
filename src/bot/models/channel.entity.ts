import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.CHANNEL)
export class Channel {
  
  @PrimaryColumn({type : "text"})
  id: string;

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
  parentId: string;
    static find: any;
  static updateOne: any;
}
