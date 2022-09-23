import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { TABLE } from '../constants/table';

@Entity(TABLE.PENATLY)
export class Penalty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  user_id: string;

  @Column({ type: "text" })
  username: string;

  @Column({ type: "boolean" })
  ammount: number;

  @Column({ type: "text" })
  reason: string;

  @Column({ type: "date" })
  createdTimestamp: Date;

  @Column({ type: "boolean" })
  is_reject: boolean;

  @Column({ type: "text" })
  channel_id: string;

  @Column({ type: "boolean" })
  delete: boolean;
}
