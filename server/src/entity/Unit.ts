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
}
