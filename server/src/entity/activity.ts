import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Unit } from "./Unit";
import { Allocation } from "./Allocation";

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
  })
  activityCode!: string;

  @ManyToOne(() => Unit, (unit) => unit.activities)
  // @JoinColumn({ name: "unit_code", referencedColumnName: "unit_code" })
  unit!: Unit;

  @Column({
    type: "varchar",
  })
  offeringPeriod!: string;

  @Column({ type: "varchar" })
  activityGroup!: string;

  @Column({
    type: "varchar",
    length: 2,
  })
  campus!: string;

  @Column({ type: "varchar" })
  location!: string;

  @Column({ type: "int" })
  duration!: number;

  @Column({
    type: "varchar",
    length: 3,
  })
  dayOfWeek!: number;

  @Column({ type: "time" })
  startTime!: Date;

  @OneToMany(() => Activity, (activity) => activity.allocations)
  allocations!: Allocation[];
}
