import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Activity } from "./activity";
import { StaffPreference } from "./staffPreference";

@Entity()
export class Unit {
  @PrimaryColumn({
    type: "char",
    length: 7,
  })
  unit_code!: string;

  @PrimaryColumn({
    type: "varchar",
  })
  offering_period!: string;

  @Column({
    type: "char",
    length: 2,
  })
  campus!: string;

  @Column({ type: "int" })
  aqf_target!: number;

  @OneToMany(() => Activity, (activity) => activity.unit)
  activities!: Activity[];

  @OneToMany(() => StaffPreference, (staffPreference) => staffPreference.unit)
  staffPreference!: StaffPreference[];
}
