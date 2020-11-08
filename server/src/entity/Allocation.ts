import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DayOfWeek } from "../enums/DayOfWeek";
import { Activity } from "./Activity";
import { Staff } from "./Staff";

@Entity()
export class Allocation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // TODO: lec,staff,workforce Confirmation(s) booleans or Enum

  @ManyToOne(() => Activity, (activity) => activity.allocations, {
    primary: true,
  })
  activity!: Activity;

  @ManyToOne(() => Staff, (staff) => staff.allocations, { primary: true })
  staff!: Staff;
}
