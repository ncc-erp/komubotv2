import { Column, Entity } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.DATING)
export class Dating {
  @Column({ nullable: false })
  channelId: string;

  @Column({ type: "array", nullable: false })
  userId: string;

  @Column({ type: "array", nullable: false })
  email: string;

  @Column()
  sex: number;

  @Column()
  loop: number;

  @Column({ type: "decimal" })
  createdTimestamp: number;
}
