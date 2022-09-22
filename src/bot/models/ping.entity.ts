import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.PING)
export class Ping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: false })
  channelId: string;

  @Column({ type: "text", nullable: false })
  status: boolean;

  @Column({ type: "decimal", nullable: false })
  start_time: number;
}
