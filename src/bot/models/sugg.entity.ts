import { Column, Entity } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.SUGG)
export class Sugg {
  @Column({ type: "text", nullable: true })
  autorID: string;

  @Column({ type: "text", nullable: true })
  messageID: string;

  @Column({ type: "text", nullable: true })
  serverID: string;

  @Column({ type: "text", nullable: true })
  content: string;

  @Column({ type: "decimal", nullable: true })
  Date: number;
}
