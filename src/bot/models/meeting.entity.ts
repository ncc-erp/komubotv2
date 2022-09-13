import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.MEETING)
export class Meeting {
  @Column({ type: "text", nullable: true })
  channelId: string;

  @Column({ type: "date", nullable: true })
  createdTimestamp: Date;

  @Column({ type: "text", nullable: true })
  task: string;

  @Column({ type: "text", nullable: true })
  repeat: string;

  @Column({ nullable: true })
  cancel: boolean;

  @Column({ nullable: true })
  reminder: boolean;
}
