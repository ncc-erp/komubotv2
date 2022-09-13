import { Column, Entity } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.BWL)
export class Bwl {
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
