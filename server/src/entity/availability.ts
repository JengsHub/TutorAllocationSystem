import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Staff } from "./staff";

@Entity()
export class Availability {
  @ManyToOne(() => Staff, (staff) => staff.availability, { primary: true })
  staff!: Staff;

  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column({ type: "time" })
  timeRanges!: number;

  @Column({ type: "int" })
  maxHours!: number;

  @Column({ type: "int" })
  maxNumberActivities!: number;
}
