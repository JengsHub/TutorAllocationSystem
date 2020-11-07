import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, } from "typeorm";
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

  @OneToMany(() => Activity, (activity) => activity.allocations)
  allocations!: Allocation[];

  @ManyToOne(() => Unit, (unit) => unit.activities)
  unit!: Unit;
}
