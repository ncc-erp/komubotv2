import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.EVENT)
export class EventEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", nullable: true })
    createdTimestamp: number;

    @Column({ type: "text", nullable: true })
    title: string;

    @Column({ nullable: true, default: false })
    cancel: boolean;

    @Column({ nullable: true, default: false })
    reminder: boolean;

    @Column({ nullable: true, type: "text", array: true })
    user: string[]
}
