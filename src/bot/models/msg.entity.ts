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

  @Column({type: "text", array : true})
  embeds: string[];

  @Column({type: "text", array : true})
  components: string[];

  @Column({type: "text", array : true})
  attachments: string[];

  @Column({type: "text", array : true})
  stickers: string[];

  @Column({ type: "date" })
  editedTimestamp: Date;

  @Column({type : "text", array : true })
  reactions: string[];

  @Column({type : "text", array : true })
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
  interaction: string;
}
