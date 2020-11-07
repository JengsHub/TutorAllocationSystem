import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Allocation } from "./Allocation";
import { Availability } from "./Availability";
import { StaffPreference } from "./StaffPreference";

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
  @JoinColumn()
  allocations!: Allocation[];

  @OneToMany(() => StaffPreference, (staffPreference) => staffPreference.staff)
  staffPreference!: StaffPreference[];

  @OneToMany(() => Availability, (availability) => availability.staff)
  @JoinColumn()
  availability!: Availability[];
}
