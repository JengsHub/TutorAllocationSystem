import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, } from "typeorm";
import { DayOfWeek } from "../enums/DayOfWeek";
import { Allocation } from "./Allocation";
import { Unit } from "./Unit";

@Entity()
@Unique(["activityCode"])
export class Activity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  activityCode!: string;

  @Column()
  activityGroup!: string;

  // TODO: Do we need campus if campus is also in unit ?
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
    type: "enum",
    enum: DayOfWeek
  })
  dayOfWeek!: DayOfWeek;

  @Column({ type: "time" })
  startTime!: number;

  @OneToMany(() => Activity, (activity) => activity.allocations)
  allocations!: Allocation[];

  @ManyToOne(() => Unit, (unit) => unit.activities)
  unit!: Unit;
}
