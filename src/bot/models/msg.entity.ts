import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";
import { User } from "./user.entity";

@Entity(TABLE.MSG)
export class Msg {
  @PrimaryGeneratedColumn()
  id: string;

  // @ManyToOne(() => User, (state) => state.msg)
  // @JoinTable({ name: "user" })
  // user: User;

  @Column({ type: "text",nullable: true })
  channelId: string;

  @Column({ type: "text",nullable: true })
  guildId: string;

  @Column({ nullable: true, type: "boolean" })
  deleted: boolean;

  @Column({ type: "decimal", nullable: true })
  createdTimestamp: number;

  @Column({ type: "text",nullable: true })
  type: string;

  @Column({ type: "boolean" ,nullable: true})
  system: boolean;

  @Column({ type: "text" ,nullable: true})
  content: string;

  @Column({ type: "text",nullable: true })
  author: string;

  @Column({ type: "boolean",nullable: true })
  pinned: boolean;

  @Column({ type: "boolean" ,nullable: true})
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
