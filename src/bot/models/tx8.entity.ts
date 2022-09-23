import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.TX8)
export class TX8 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  messageId: string;

  @Column({ type: "text", nullable: true })
  userId: string;

  @Column({ type: "text", nullable: true })
  tx8number: number;

  @Column({ type: "text", nullable: true })
  status: string;

  @Column({ type: "decimal" })
  createdTimestamp: number;
}
