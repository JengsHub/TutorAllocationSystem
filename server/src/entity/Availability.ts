import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Staff } from "./Staff";

@Entity()
export class Availability {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Staff, (staff) => staff.availability, { primary: true })
  staff!: Staff;

  @Column({ type: "time" })
  timeRanges!: number;

  @Column({ type: "int" })
  maxHours!: number;

  @Column({ type: "int" })
  maxNumberActivities!: number;
}
