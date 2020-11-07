import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DayOfWeek } from "../enums/DayOfWeek";
import { Staff } from "./Staff";

@Entity()
export class Availability {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "enum", enum: DayOfWeek })
  day!: DayOfWeek;

  @Column({ type: "time" })
  startTime!: number;

  @Column({ type: "time" })
  endTime!: number;

  @Column()
  year!: number;

  @Column()
  maxHours!: number;

  @Column()
  maxNumberActivities!: number;

  @ManyToOne(() => Staff, (staff) => staff.availability, { primary: true })
  staff!: Staff;
}
