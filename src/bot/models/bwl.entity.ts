import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.BWL)
export class Bwl {
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

  @Column("text", { array: true })
  link: string[];

  @Column({ type: "decimal", nullable: true })
  createTimestamp: number;
}
