import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.CHECK_CAMERA)
export class CompanyTrip {
  @Column({ nullable: false })
  year: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  office: string;

  @Column()
  role: string;

  @Column()
  kingOfRoom: string;

  @Column()
  room: string;
}
