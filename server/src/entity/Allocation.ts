import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  AfterLoad,
} from "typeorm";
import { addDays } from "~/helpers";
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

  //expiry date default: 7 days from current date
  @Column({ type: "timestamptz", default: addDays(new Date(), 5).toUTCString()})
  offerExpiryDate!: Date;

  @Column({ nullable: true, default: null })
  isLecturerApproved?: boolean;

  @Column({ nullable: true, default: false })
  isTaAccepted?: boolean;

  @Column({ nullable: true, default: null })
  isWorkforceApproved?: boolean;

  @OneToMany(() => StatusLog, (statusLog) => statusLog.allocation)
  statusLog!: StatusLog[];

  isExpired!: boolean; //status

  @AfterLoad()
  checkExpiry() {
    const todayDate = new Date();
    //check if isExpired
    if (todayDate >= this.offerExpiryDate) {
      this.isExpired = true; //isExprid = true
    }
  }
}

//Things to consider:
//find a way to allow lectruers to decide the offer expiry date, else the default value is 7 days