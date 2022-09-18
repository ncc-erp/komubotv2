<<<<<<< HEAD
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { TABLE } from '../constants/table';

@Entity(TABLE.USER)
export class User {
  static filter(arg0: { id: string; deactive: { $ne: boolean; }; $or: { roles_discord: { $all: string[]; }; }[]; }) {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  username: string;

  @Column({ type: "text" })
  discriminator: string;

  @Column({ type: "text" })
  avatar: string;

  @Column({ type: "boolean" })
  bot: boolean;

  @Column({ type: "boolean" })
  system: boolean;

  @Column({ type: "boolean" })
  mfa_enabled: boolean;

  @Column({ type: "text" })
  banner: string;

  @Column({ type: "text" })
  accent_color: string;

  @Column({ type: "text" })
  locale: string;

  @Column({ type: "boolean" })
  verified: boolean;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "decimal" })
  flags: number;

  @Column({ type: "decimal" })
  premium_type: number;

  @Column({ type: "decimal" })
  public_flags: number;

  @Column({ type: "text" })
  last_message_id: string;

  @Column({ type: "text" })
  last_mentioned_message_id: string;

  @Column({ type: "decimal" })
  scores_quiz: number;

  @Column({})
  roles: string[];

  @Column({ type: "boolean" })
  pending_wfh: boolean;

  @Column({ type: "text" })
  last_bot_message_id: string;

  @Column({ type: "boolean" })
  deactive: boolean;

  @Column({})
  roles_discord: string[];

  @Column({ type: "boolean" })
=======
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.USER)
export class User {
  @PrimaryGeneratedColumn({})
  id: number

  @Column({ type: "text",nullable: true, unique: true })
  userId: string;

  @Column({ type: "text", nullable: true })
  username: string;

  @Column({ type: "text", nullable: true })
  discriminator: string;

  @Column({ type: "text", nullable: true })
  avatar: string;

  @Column({ nullable: true })
  bot: boolean;

  @Column({ nullable: true })
  system: boolean;

  @Column({ nullable: true })
  mfa_enabled: boolean;

  @Column({ type: "text", nullable: true })
  banner: string;

  @Column({ type: "text", nullable: true })
  accent_color: string;

  @Column({ type: "text", nullable: true })
  locale: string;

  @Column({ nullable: true })
  verified: boolean;

  @Column({ type: "text", nullable: true })
  email: string;

  @Column({ nullable: true })
  flags: number;

  @Column({ nullable: true })
  premium_type: number;

  @Column({ nullable: true })
  public_flags: number;

  @Column({ type: "text", nullable: true })
  last_message_id: string;

  @Column({ type: "text", nullable: true })
  last_mentioned_message_id: string;

  @Column({ default: 0 })
  scores_quiz: number;

  @Column({ type: "text", array: true, nullable: true })
  roles: string[];

  @Column({ nullable: true })
  pending_wfh: boolean;

  @Column({ type: "text", nullable: true })
  last_bot_message_id: string;

  @Column({ type: "boolean", nullable: true })
  deactive: boolean;

  @Column({ type: "text", array: true, nullable: true })
  roles_discord: string[];
  @Column({ default: false })
>>>>>>> task/entity
  botPing: boolean;
}
