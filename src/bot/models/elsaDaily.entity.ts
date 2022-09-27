import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.ELSADAILY)
export class ElsaDaily {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userid: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  daily: string;

  @Column({ default: false })
  attachment: boolean;

  @Column({ type: "decimal" })
  createdAt: number;

  @Column({ nullable: true })
  channelid: string;
}
