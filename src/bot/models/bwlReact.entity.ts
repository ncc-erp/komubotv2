import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.BWLREACTION)
export class BwlReaction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  channelId: string;

  @Column()
  messageId: string;

  @Column()
  guildId: string;

  @Column()
  authorId: string;

  @Column()
  emoji: string;

  @Column()
  count: number;
}
