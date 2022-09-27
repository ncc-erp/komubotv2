import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.BWL)
export class Bwl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channelId: string;

  @Column()
  messageId: string;

  @Column()
  guildId: string;

  @Column()
  authorId: string;

  @Column({ type: "array" })
  link: string;

  @Column({ type: "date" })
  createTimestamp: number;
}
