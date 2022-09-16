import { Column, Entity, PrimaryColumn,  } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.USER)
export class User {
<<<<<<< HEAD
  @PrimaryGeneratedColumn({})
  id: number

  @Column({ nullable: true, unique: true })
=======
  @PrimaryColumn()
>>>>>>> develop
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

<<<<<<< HEAD
  @Column({ type: "text", array: true })
=======
  @Column({type : 'text', array : true})
>>>>>>> develop
  roles: string;

  @Column({ nullable: true })
  pending_wfh: boolean;

  @Column({ type: "text", nullable: true })
  last_bot_message_id: string;

  @Column({type:"boolean"})
  deactive: boolean;

<<<<<<< HEAD
  @Column({ type: "text", array: true })
=======
  @Column({type : 'text', array : true})
>>>>>>> develop
  roles_discord: string;

  @Column({ default: false })
  botPing: boolean;
}
