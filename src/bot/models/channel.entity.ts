import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.CHANNEL)
export class Channel {
<<<<<<< HEAD
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
=======
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
>>>>>>> task/entity
}
