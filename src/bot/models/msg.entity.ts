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

  @Column({ type: "decimal", nullable: true })
  createdTimestamp: number;

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

  @Column({ type: "text", nullable: true })
  nonce: string;

  @Column({ type: "text", array: true, nullable: true })
  embeds: string[];

  @Column({ type: "text", array: true, nullable: true })
  components: string[];

  @Column({ nullable: true, type: "text", array: true })
  attachments: string[];

  @Column({ nullable: true, type: "text", array: true })
  stickers: string[];

  @Column({ type: "decimal", nullable: true })
  editedTimestamp: number;

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
