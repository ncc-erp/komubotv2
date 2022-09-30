import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";
import { Msg } from "./msg.entity";
import { User } from "./user.entity";

@Entity(TABLE.TX8)
export class TX8 {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Msg)
  @JoinColumn({ name: "messageId" })
  messageId: Msg;

  @ManyToOne(() => User)
  @JoinColumn({ name: "authorId" })
  userId: User;

  @Column({ type: "text", nullable: true })
  tx8number: number;

  @Column({ type: "text", nullable: true })
  status: string;

  @Column({ type: "decimal" })
  createdTimestamp: number;
}
