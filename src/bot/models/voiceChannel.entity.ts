import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.VOICECHANNELS)
export class VoiceChannels {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  originalName: string;

  @Column({ nullable: false })
  newRoomName: string;

  @Column({ nullable: false, default: 0 })
  people: number;

  @Column()
  status: string;

  @Column()
  createdTimestamp: string;
}
