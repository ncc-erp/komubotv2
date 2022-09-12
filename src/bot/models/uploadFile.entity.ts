import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.UPLOADFILEDB)
export class UploadFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  filePath: string;

  @Column({})
  fileName: string;

  @Column({ type: "decimal", nullable: true })
  createTimestamp: number;

  @Column({ unique: true })
  episode: number;
}
