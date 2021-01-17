import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Activity } from "./Activity";
import { Staff } from "./Staff";
import { StatusLog } from "./StatusLog";

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

  @OneToMany(() => StatusLog, (statusLog) => statusLog.allocation)
  statusLog!: StatusLog[];
}
