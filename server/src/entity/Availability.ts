import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { DayOfWeek } from "../enums/DayOfWeek";
import { Staff } from "./Staff";

@Entity()
export class Availability {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // @Column({ type: "enum", enum: DayOfWeek })
  @Column({ type: "varchar" })
  day!: DayOfWeek;

  @Column({ type: "time" })
  startTime!: string;

  @Column({ type: "time" })
  endTime!: string;

  @Column()
  year!: number;

  @Column()
  maxHours!: number;

  @Column()
  maxNumberActivities!: number;

  @ManyToOne(() => Staff, (staff) => staff.availability, { primary: true })
  staff!: Staff;

  @RelationId((a: Availability) => a.staff)
  staffId!: string;
}