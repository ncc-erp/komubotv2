import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.MSG)
export class Msg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  channelId: string;

  @Column({ type: "text" })
  guildId: string;

  @Column({ nullable: true, type: "boolean" })
  deleted: boolean;

  @Column({ nullable: true, type: "date" })
  createdTimestamp: Date;

  @Column({ type: "text" })
  type: string;

  @Column({ type: "boolean" })
  system: boolean;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "text" })
  author: string;

  @Column({ type: "boolean" })
  pinned: boolean;

  @Column({ type: "boolean" })
  tts: boolean;

  @Column({ type: "text" })
  nonce: string;

  @Column({ nullable: true, type: "text", array: true })
  embeds: string[];

  @Column({ nullable: true, type: "text", array: true })
  components: string[];

  @Column({ nullable: true, type: "text", array: true })
  attachments: string[];

  @Column({ nullable: true, type: "text", array: true })
  stickers: string[];

  @Column({ nullable: true, type: "date" })
  editedTimestamp: Date;

  @Column({ nullable: true, type: "text", array: true })
  reactions: string[];

  @Column({ nullable: true, type: "text", array: true })
  mentions: string[];

  @Column({ nullable: true, type: "text" })
  webhookId: string;

  @Column({ nullable: true, type: "text" })
  groupActivityApplication: string;

  @Column({ nullable: true, type: "text" })
  applicationId: string;

  @Column({ nullable: true, type: "text" })
  activity: string;

  @Column({ nullable: true, type: "decimal" })
  flags: number;

  @Column({ nullable: true, type: "text" })
  reference: string;

  @Column({ nullable: true, type: "text" })
  interaction: string;
}
