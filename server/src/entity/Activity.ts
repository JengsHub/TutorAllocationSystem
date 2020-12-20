import {
  BaseEntity,
  Column,
  Entity,
  getConnection,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from "typeorm";
import { IActivity } from "../../../client/src/types";
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

  @OneToMany(() => Allocation, (allocation) => allocation.activity)
  allocations!: Allocation[];

  // @RelationId((activity: Activity) => activity.allocations)
  // allocationIds!: string[];

  @ManyToOne(() => Unit, (unit) => unit.activities)
  @JoinColumn({ name: "unitId" })
  unit!: Unit;

  @Column()
  unitId!: string;

  static async insertActivityIntoDb(valueToInsert: IActivity) {
    /**
     * Inserts new activity item into database if not present, else update the existing activity
     * Returns user
     */
    // find whether current value is already in database
    var inDB = true;
    try {
      await getConnection()
        .getRepository(Activity)
        .createQueryBuilder("activity")
        .where(
          "activity.activityCode = :activityCode AND activity.unitId = :unitId",
          {
            activityCode: valueToInsert.activityCode,
            unitId: valueToInsert.unitId,
          }
        )
        .getOneOrFail();
    } catch (EntityNotFoundError) {
      inDB = false;
      // insert activity row if entity not found in database
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Activity)
        .values(valueToInsert)
        .execute();
    }

    if (inDB) {
      // if already in db, then just update all the values
      // calculating the end time by adding duration to start time
      var durationInHours = Math.floor(valueToInsert.duration / 60);
      var durationInMins = valueToInsert.duration % 60;
      var inputStartHour = parseInt(valueToInsert.startTime.split(":")[0]);
      var inputStartMinute = parseInt(valueToInsert.startTime.split(":")[1]);
      var inputEndMinute = (inputStartMinute + durationInMins).toString();
      var inputEndHour = (inputStartHour + durationInHours).toString();
      var inputEndTime = inputEndHour.concat(inputEndMinute);
      // update the activity in db
      await getConnection()
        .createQueryBuilder()
        .update(Activity)
        .set({
          endTime: inputEndTime,
          activityGroup: valueToInsert.activityGroup,
          campus: valueToInsert.campus,
          location: valueToInsert.location,
          dayOfWeek: valueToInsert.dayOfWeek,
          startTime: valueToInsert.startTime,
        })
        .where(
          "activity.activityCode = :activityCode AND activity.unitId = :unitId",
          {
            activityCode: valueToInsert.activityCode,
            unitId: valueToInsert.unitId,
          }
        )
        .execute();
    }
    const user = await getConnection()
      .getRepository(Activity)
      .createQueryBuilder("activity")
      .where(
        "activity.activityCode = :activityCode AND activity.unitId = :unitId",
        {
          activityCode: valueToInsert.activityCode,
          unitId: valueToInsert.unitId,
        }
      )
      .getOne();

    return user;
  }
}
