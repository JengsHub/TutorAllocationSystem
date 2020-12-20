import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  getConnection,
} from "typeorm";
import { IUnits } from "../../../client/src/types";
import { Activity } from "./Activity";
import { Role } from "./Role";
import { StaffPreference } from "./StaffPreference";

@Entity()
@Unique(["unitCode", "offeringPeriod", "year"])
export class Unit extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
    length: 7,
  })
  unitCode!: string;

  @Column()
  offeringPeriod!: string;

  @Column({
    type: "varchar",
    length: 2,
  })
  campus!: string;

  @Column()
  year!: number;

  @Column()
  aqfTarget!: number;

  @OneToMany(() => Activity, (activity) => activity.unit)
  activities!: Activity[];

  @OneToMany(() => StaffPreference, (staffPreference) => staffPreference.unit)
  staffPreference!: StaffPreference[];

  @OneToMany(() => Role, (role) => role.unit)
  roles!: Role[];

  static async insertUnitIntoDb(valueToInsert: IUnits) {
    /**
     * Inserts new unit item into database if not present, else update the existing unit
     */
    // find whether current value is already in database
    var inDB = true;
    try {
      await getConnection()
        .getRepository(Unit)
        .createQueryBuilder("unit")
        .where(
          "unit.unitCode = :unitCode AND unit.offeringPeriod = :offeringPeriod AND unit.year = :year",
          {
            unitCode: valueToInsert.unitCode,
            offeringPeriod: valueToInsert.offeringPeriod,
            year: valueToInsert.year,
          }
        )
        .getOneOrFail();
    } catch (EntityNotFoundError) {
      inDB = false;
      // insert new unit row if entity not found in database
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Unit)
        .values(valueToInsert)
        .execute();
    }

    if (inDB) {
      // if already in db, then just update all the values
      await getConnection()
        .createQueryBuilder()
        .update(Unit)
        .set({
          campus: valueToInsert.campus,
          aqfTarget: valueToInsert.aqfTarget,
        })
        .where(
          "unit.unitCode = :unitCode AND unit.offeringPeriod = :offeringPeriod AND unit.year = :year",
          {
            unitCode: valueToInsert.unitCode,
            offeringPeriod: valueToInsert.offeringPeriod,
            year: valueToInsert.year,
          }
        )
        .execute();
    }
    const unit = await getConnection()
      .getRepository(Unit)
      .createQueryBuilder("unit")
      .where(
        "unit.unitCode = :unitCode AND unit.offeringPeriod = :offeringPeriod AND unit.year = :year",
        {
          unitCode: valueToInsert.unitCode,
          offeringPeriod: valueToInsert.offeringPeriod,
          year: valueToInsert.year,
        }
      )
      .getOne();

    return unit;
  }
}
