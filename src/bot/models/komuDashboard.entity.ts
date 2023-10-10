import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TABLE } from "../constants/table";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

@Entity(TABLE.KOMUDASHBOARD)
export class KomuDashboard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  email: string;

  @Column({ type: "text", nullable: true })
  username: string;

  @Column({ type: "text", nullable: true })
  @Exclude()
  password: string;

  @Column({ type: "decimal", nullable: true })
  createdTimestamp: number;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
