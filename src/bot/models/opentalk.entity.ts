import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.OPEN_TALK)
export class OpenTalk {
  @Column({ type: "text", nullable: false })
  userId: string;

  @Column({ type: "text", nullable: false })
  username: string;

  @Column({ type: "date", nullable: true })
  date: number;
}
