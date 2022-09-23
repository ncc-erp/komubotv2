import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.VOICECHANNELS)
export class VoiceChannels {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: "text" })
  originalName: string;

  @Column({ nullable: true, type: "text" })
  newRoomName: string;

  @Column({ nullable: true, type: "decimal" })
  people: number;

  @Column({ nullable: true, type: "text" })
  status: string;

  @Column({ type: "decimal" })
  createdTimestamp: number;
}
