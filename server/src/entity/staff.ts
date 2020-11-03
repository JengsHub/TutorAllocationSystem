import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Allocation } from "./allocation";
import { StaffPreference } from "./staffPreference";
import { Availability } from "./availability";

@Entity()
export class Staff {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column({
    type: "text",
  })
  givenNames!: string;

  @Column({
    type: "text",
  })
  lastName!: string;

  @Column({ type: "int" })
  aqf!: number;

  @Column({ type: "int" })
  studyingAqf!: number;

  @Column({
    type: "text",
    unique: true,
  })
  email!: string;

  @OneToMany(() => Allocation, (allocation) => allocation.staff)
  allocations!: Allocation[];

  @OneToMany(() => StaffPreference, (staffPreference) => staffPreference.staff)
  staffPreference!: StaffPreference[];

  @OneToMany(() => Availability, (availability) => availability.staff)
  availability!: Availability[];
}
