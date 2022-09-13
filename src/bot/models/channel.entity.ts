import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.CHANNEL)
export class Channel {
  @Column({ nullable: true })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column()
  nsfw: boolean;

  @Column()
  rawPosition: number;

  @Column()
  lastMessageId: string;

  @Column()
  rateLimitPerUser: number;

  @Column()
  parentId: string;
}
