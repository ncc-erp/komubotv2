<<<<<<< HEAD
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
=======
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
>>>>>>> task/entity

import { TABLE } from "../constants/table";

@Entity(TABLE.MSG)
<<<<<<< HEAD
export class Msg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  channelId: string;

  @Column({ type: "text" })
  guildId: string;

  @Column({ type: "boolean" })
  deleted: boolean;
  
  @Column({ type: "date" })
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

  @Column({})
  embeds: string[];

  @Column({})
  components: string[];

  @Column({})
  attachments: string[];

  @Column({})
  stickers: string[];

  @Column({ type: "date" })
  editedTimestamp: Date;

  @Column({})
  reactions: string[];

  @Column({})
  mentions: string[];

  @Column({ type: "text" })
  webhookId: string;

  @Column({ type: "text" })
  groupActivityApplication: string;

  @Column({ type: "text" })
  applicationId: string;

  @Column({ type: "text" })
  activity: string;

  @Column({ type: "decimal" })
  flags: number;

  @Column({ type: "text" })
  reference: string;

  @Column({ type: "text" })
=======
export class Message {
  @Column({ type: "text", nullable: true })
  channelId: string;

  @Column({ type: "text", nullable: true })
  guildId: string;

  @Column({ nullable: true })
  deleted: boolean;

  @Column({ nullable: true, unique: true })
  id: string;

  @Column({ type: "date", nullable: true })
  createdTimestamp: number;

  @Column({ type: "text", nullable: true })
  type: string;

  @Column({ nullable: true })
  system: boolean;

  @Column({ type: "text", nullable: true })
  content: string;

  @Column({ type: "text", nullable: true })
  author: string;

  @Column({ nullable: true })
  pinned: boolean;

  @Column({ nullable: true })
  tts: boolean;

  @Column({ type: "text", nullable: true })
  nonce: string;

  @Column({ type: "array", nullable: true })
  embeds: string;

  @Column({ type: "array", nullable: true })
  components: string;

  @Column({ type: "array", nullable: true })
  attachments: string;

  @Column({ type: "array", nullable: true })
  stickers: string;

  @Column({ nullable: false })
  editedTimestamp: number;

  @Column({ type: "array", nullable: true })
  reactions: string;

  @Column({ type: "array", nullable: true })
  mentions: string;

  @Column({ type: "text", nullable: true })
  webhookId: string;

  @Column({ type: "text", nullable: true })
  groupActivityApplication: string;

  @Column({ type: "text", nullable: true })
  applicationId: string;

  @Column({ type: "text", nullable: true })
  activity: string;

  @Column({ nullable: true })
  flags: number;

  @Column({ type: "text", nullable: true })
  reference: string;

  @Column({ type: "text", nullable: true })
>>>>>>> task/entity
  interaction: string;
}
