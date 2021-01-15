import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
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

  static async createOrUpdateUnit(newRecord: Unit) {
    try {
      let unitToUpdate = await Unit.findOne({
        where: {
          unitCode: newRecord.unitCode,
          offeringPeriod: newRecord.offeringPeriod,
          year: newRecord.year,
        },
      });
      if (unitToUpdate) {
        await Unit.update({ id: unitToUpdate.id }, newRecord);
        newRecord.id = unitToUpdate.id;
        return newRecord;
      }
      return await Unit.save(newRecord);
    } catch (e) {
      console.error(
        `error creating/updating unit ${newRecord.unitCode} ${newRecord.offeringPeriod} ${newRecord.year}`
      );
      console.error(e);
      throw e;
    }
  }
}
