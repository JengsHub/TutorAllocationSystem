import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Activity } from "./Activity";
import { Staff } from "./Staff";

@Entity()
export class Allocation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  activityGroup!: string;

  @Column({
    type: "varchar",
    length: 2,
  })
  campus!: string;

  @Column()
  location!: string;

  @Column()
  duration!: number;

  @Column({
    type: "varchar",
    length: 3,
  })
  dayOfWeek!: number;

  @Column({ type: "time" })
  startTime!: Date;

  @ManyToOne(() => Activity, (activity) => activity.allocations, {
    primary: true,
  })
  activity!: Activity;

  @ManyToOne(() => Staff, (staff) => staff.allocations, { primary: true })
  staff!: Staff;
}
