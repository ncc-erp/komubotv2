import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { TABLE } from "../constants/table";
import { WorkFromHome } from "./wfh.entity";

@Entity(TABLE.USER)
export class UserQuiz {
  @PrimaryGeneratedColumn()
  quizId: number;

  @Column({ type: "text", nullable: true })
  userId: string;

  @Column({ nullable: true })
  correct: boolean;

  @Column({ nullable: true })
  answer: number;

  @Column({ nullable: true, type: "decimal" })
  createAt: number;
}
