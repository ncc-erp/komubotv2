import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.MSG)
export class Message {
  @PrimaryGeneratedColumn()
  id : number;
  
  @Column({ type: "text", nullable: true })
  channelId: string;

  @Column({ type: "text", nullable: true })
  guildId: string;

  @Column({ nullable: true })
  deleted: boolean;

  @Column()
  messageId: string;

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

  @Column({ type: "text", array : true, nullable: true })
  embeds: string;

  @Column({ type: "text", array : true, nullable: true })
  components: string;

  @Column({ type: "text", array : true, nullable: true })
  attachments: string;

  @Column({ type: "text", array : true, nullable: true })
  stickers: string;

  @Column({ nullable: false })
  editedTimestamp: number;

  @Column({ type: "text", array : true, nullable: true })
  reactions: string;

  @Column({ type: "text", array : true, nullable: true })
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
  interaction: string;
}
