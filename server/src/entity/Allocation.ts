import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { Activity } from "./Activity";
import { Staff } from "./Staff";

@Entity()
export class Allocation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Activity, (activity) => activity.allocations, {
    primary: true,
  })
  activity!: Activity;

  @Column()
  activityId!: string;

  @ManyToOne(() => Staff, (staff) => staff.allocations, { primary: true })
  staff!: Staff;

  @Column()
  staffId!: string;

  @Column({ nullable: true, default: null })
  isLecturerApproved?: boolean;

  @Column({ nullable: true, default: false })
  isTaAccepted?: boolean;

  @Column({ nullable: true, default: null })
  isWorkforceApproved?: boolean;
}
