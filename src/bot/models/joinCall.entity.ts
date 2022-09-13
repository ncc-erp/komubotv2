import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.JOIN_CALL)
export class JoinCall {
  @Column({ nullable: false })
  channelId: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  status: string;

  @Column({ type: "decimal" })
  start_time: number;

  @Column({ type: "decimal" })
  end_time: number;
}
