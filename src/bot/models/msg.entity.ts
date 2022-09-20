import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.MSG)
export class Message {
  @PrimaryGeneratedColumn()
  msgid: number;

  @Column({ type: "text", nullable: true })
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

  @Column({ type: "text", nullable: true })
  embeds: string;

  @Column({ type: "text", nullable: true })
  components: string;

  @Column({ type: "text", nullable: true })
  attachments: string;

  @Column({ type: "text", nullable: true })
  stickers: string;

  @Column({ type: "date" })
  editedTimestamp: Date;

  @Column({ type: "text", nullable: true })
  reactions: string;

  @Column({ type: "text", nullable: true })
  mentions: string;

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
  interaction: string;
}
