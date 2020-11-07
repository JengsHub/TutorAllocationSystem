import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Activity } from "./Activity";
import { StaffPreference } from "./StaffPreference";

@Entity()
export class Unit {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @PrimaryColumn({
    type: "varchar",
    length: 7,
  })
  unitCode!: string;

  @PrimaryColumn({
    type: "varchar",
  })
  offeringPeriod!: string;

  @Column({
    type: "varchar",
    length: 2,
  })
  campus!: string;

  @Column({ type: "int" })
  aqfTarget!: number;

  @OneToMany(() => Activity, (activity) => activity.unit)
  activities!: Activity[];

  @OneToMany(() => StaffPreference, (staffPreference) => staffPreference.unit)
  staffPreference!: StaffPreference[];
}
