import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Allocation } from "./Allocation";
import { Availability } from "./Availability";
import { StaffPreference } from "./StaffPreference";

@Entity()
export class Staff extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  givenNames!: string;

  @Column({ nullable: true })
  lastName!: string;

  @Column({ nullable: true })
  aqf!: number;

  @Column({ nullable: true })
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

  @Column({ nullable: true })
  googleId?: string;
}
