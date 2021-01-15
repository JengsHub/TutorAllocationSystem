import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { DayOfWeek } from "../enums/DayOfWeek";
import { Allocation } from "./Allocation";
import { Unit } from "./Unit";

@Entity()
@Unique(["activityCode", "unit"])
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
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
  endTime!: string;

  // TODO: varchar for sqlite compatibility in test?
  @Column({
    type: "varchar",
  })
  dayOfWeek!: DayOfWeek;

  @Column({ type: "time" })
  startTime!: string; // TODO: Date object or string to store time only?

  @Column({ default: 0 }) // TODO: need default?
  duration!: number;

  @OneToMany(() => Allocation, (allocation) => allocation.activity)
  allocations!: Allocation[];

  // @RelationId((activity: Activity) => activity.allocations)
  // allocationIds!: string[];

  @ManyToOne(() => Unit, (unit) => unit.activities)
  @JoinColumn({ name: "unitId" })
  unit!: Unit;

  @Column()
  unitId!: string;

  static async createOrUpdateActivity(newRecord: Activity) {
    let unit = await Unit.findOneOrFail({
      id: newRecord.unitId,
    });

    // newRecord.unit = unit;
    let activityToUpdate = await Activity.findOne({
      activityCode: newRecord.activityCode,
      unit: unit,
    });

    if (activityToUpdate) {
      Activity.update({ id: activityToUpdate.id }, newRecord);
      newRecord.id = activityToUpdate.id;
      return newRecord;
    }
    return Activity.save(Activity.create(newRecord));
  }
}
