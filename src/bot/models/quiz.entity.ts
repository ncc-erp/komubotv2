import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.QUESTION)
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  title: string;

  @Column("text", { array: true, nullable: true })
  options: string[];

  @Column({ type: "text" })
  correct: string;

  @Column({ type: "text" })
  role: string;

  @Column()
  isVerify: boolean;

  @Column()
  accept: boolean;

  @Column({ type: "text" })
  author_email: string;

  @Column({ type: "text" })
  topic: string;
}
