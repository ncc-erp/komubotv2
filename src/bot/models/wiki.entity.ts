import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.WIKI)
export class Wiki {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: false })
  name: string;

  @Column({ nullable: true })
  value: string;

  @Column({ type: "decimal", nullable: false })
  type: string;

  @Column({ nullable: false })
  creator: string;

  @Column({ type: "boolean", nullable: true })
  status: string;

  @Column({ type: "decimal", nullable: true })
  createdate: number;

  @Column({ type: "boolean", nullable: true })
  note: string;
}
