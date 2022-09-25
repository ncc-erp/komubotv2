import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.TRACKER_SPENT_TIME)
export class TrackerSpentTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: false })
  email: string;

  @Column({ nullable: true })
  spent_time: number;

  @Column({ type: "text", nullable: true })
  date: string;

  @Column({ nullable: false })
  call_time: number;

  @Column({ type: "boolean", nullable: false })
  wfh: boolean;
}
