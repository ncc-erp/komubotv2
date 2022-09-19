import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.VOICECHANNELS)
export class Voicechannel {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Column({})
  //   id: string;

  @Column({ type: "text" })
  originalName: string;

  @Column({ type: "text" })
  newRoomName: string;

  @Column({ type: "decimal" })
  people: number;

  @Column({ type: "text" })
  status: string;

  @Column({ type: "date" })
  createdTimestamp: Date;
}
