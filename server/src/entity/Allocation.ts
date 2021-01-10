import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { ApprovalEnum } from "~/enums/ApprovalEnum";
import { Activity } from "./Activity";
import { Staff } from "./Staff";

@Entity()
export class Allocation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // TODO: lec,staff,workforce Confirmation(s) booleans or Enum
  @Column({ default: ApprovalEnum.INIT })
  approval!: ApprovalEnum;

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
}
