import { number } from '@hapi/joi';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { TABLE } from '../constants/table';

@Entity(TABLE.PENATLY)
export class Penalty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  userId: string;

  @Column({ type: "text", nullable : true })
  username: string;

  @Column({type : "int"})
  ammount: number;

  @Column({ type: "text" })
  reason: string;

  @Column({ type: "decimal" })
  createdTimestamp: number;

  @Column({ type: "boolean" })
  isReject: boolean;

  @Column({ type: "text" })
  channelId: string;

  @Column({ type: "boolean" })
  delete: boolean;
}
