import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Allocation } from "./Allocation";
import { StaffPreference } from "./StaffPreference";
import { Availability } from "./Availability";

@Entity()
export class Staff {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  givenNames!: string;

  @Column()
  lastName!: string;

  @Column()
  aqf!: number;

  @Column()
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
