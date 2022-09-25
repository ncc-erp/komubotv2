import { Column, Entity } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.TRACKER_SPENT_TIME)
export class TrackerSpentTime {
  @Column({ type: "text", nullable: false })
  email: string;

  @Column({ type: "double", nullable: true })
  spent_time: number;

  @Column({ type: "decimal", nullable: true })
  date: number;

  @Column({ type: "double", nullable: false })
  call_time: number;

  @Column({ type: "boolean", nullable: false })
  wfh: boolean;
}
