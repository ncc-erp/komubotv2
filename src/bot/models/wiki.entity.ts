import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.WIKI)
export class Wiki {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: false })
  name: string;

  @Column({ type: "double", nullable: true })
  value: string;

  @Column({ type: "decimal", nullable: false })
  type: string;

  @Column({ type: "double", nullable: false })
  creator: string;

  @Column({ type: "boolean", nullable: true })
  status: string;

  @Column({ type: "decimal", nullable: true })
  createdate: number;

  @Column({ type: "boolean", nullable: true })
  note: string;
}
