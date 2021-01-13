import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { ApprovalEnum } from "~/enums/ApprovalEnum";
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

  @Column({ default: false })
  isApproved!: boolean;

  @Column({ default: false })
  isAccepted!: boolean;

  @OneToMany(() => StatusLog, (statusLog) => statusLog.allocation)
  statusLog!: StatusLog[];
}
