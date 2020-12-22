import {
  BaseEntity,
  Column,
  Entity,
  getConnection,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { IAvailability } from "~/interfaces/typesInputEntites";
import { DayOfWeek } from "../enums/DayOfWeek";
import { Staff } from "./Staff";

@Entity()
export class Availability extends BaseEntity {
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

  static async insertAvailabilityIntoDb(valueToInsert: IAvailability) {
    /**
     * Inserts new activity item into database if not present, else update the existing activity
     * Returns user
     */
    // find whether current value is already in database
    var inDB = true;
    try {
      await getConnection()
        .getRepository(Availability)
        .createQueryBuilder("availability")
        .where(
          "availability.staffId = :staffId AND availability.day = :day AND availability.startTime = :startTime AND availability.year = :year",
          {
            staffId: valueToInsert.staffId,
            day: valueToInsert.day,
            startTime: valueToInsert.startTime,
            year: valueToInsert.year,
          }
        )
        .getOneOrFail();
    } catch (EntityNotFoundError) {
      inDB = false;
      // insert activity row if entity not found in database
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Availability)
        .values(valueToInsert)
        .execute();
    }

    if (inDB) {
      // update the activity in db
      await getConnection()
        .createQueryBuilder()
        .update(Availability)
        .set({
          endTime: valueToInsert.endTime,
          maxHours: valueToInsert.maxHours,
          maxNumberActivities: valueToInsert.maxNumberActivities,
          startTime: valueToInsert.startTime,
        })
        .where(
          "availability.staffId = :staffId AND availability.day = :day AND availability.startTime = :startTime AND availability.year = :year",
          {
            staffId: valueToInsert.staffId,
            day: valueToInsert.day,
            startTime: valueToInsert.startTime,
            year: valueToInsert.year,
          }
        )
        .execute();
    }
    const user = await getConnection()
      .getRepository(Availability)
      .createQueryBuilder("availability")
      .where(
        "availability.staffId = :staffId AND availability.day = :day AND availability.startTime = :startTime AND availability.year = :year",
        {
          staffId: valueToInsert.staffId,
          day: valueToInsert.day,
          startTime: valueToInsert.startTime,
          year: valueToInsert.year,
        }
      )
      .getOne();

    return user;
  }
}
