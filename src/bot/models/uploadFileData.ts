// const mongoose = require('mongoose');

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.UPLOADFILE)
export class AudioPlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  filePath: string;

  @Column("text")
  fileName: string;

  @Column({ type: "decimal", nullable: true })
  createTimestamp: number;

  @Column({ unique: true })
  episode: number;
}
