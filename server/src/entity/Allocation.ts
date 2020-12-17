import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
<<<<<<< HEAD
=======
import { ApprovalEnum } from "~/enums/ApprovalEnum";
import { DayOfWeek } from "../enums/DayOfWeek";
>>>>>>> origin/master
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

  @RelationId((a: Allocation) => a.activity)
  activityId!: string;

  @ManyToOne(() => Staff, (staff) => staff.allocations, { primary: true })
  staff!: Staff;

  @RelationId((a: Allocation) => a.staff)
  staffId!: string;
}
