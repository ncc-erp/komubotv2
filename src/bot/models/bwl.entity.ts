import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.BWL)
export class Bwl {
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

  @Column({ type: "text" })
  link: string[];

  @Column({ type: "decimal" })
  createTimestamp: number;
}
