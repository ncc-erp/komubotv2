import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";
import { Channel } from "./channel.entity";
import { User } from "./user.entity";

@Entity(TABLE.BWL)
export class Bwl {
  @PrimaryColumn()
  messageId: string;

  // @OneToMany(() => BwlReaction, (state) => state.messageId)
  // @JoinColumn()
  // bwlReact: BwlReaction[];

  @ManyToOne(() => Channel)
  @JoinColumn({ name: "channelId" })
  channelId: Channel;

  @Column({ type: "text", nullable: true })
  guildId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "authorId" })
  authorId: User;

  @Column("text", { array: true, nullable: true })
  link: string[];

  @Column({ type: "decimal", nullable: true })
  createdTimestamp: number;
}
