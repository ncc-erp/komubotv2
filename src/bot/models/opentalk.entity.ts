import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.OPENTALK)
export class Opentalk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  userId: string;

  @Column({ type: "text" })
  username: string;

  @Column({ type: "decimal" })
  createdTimestamp: number;
}
