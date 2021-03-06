import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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
  @Column({
    type: "timestamptz",
    default: addDays(new Date(), 5).toUTCString(),
  })
  offerExpiryDate!: Date;

  @Column({ nullable: true, default: null })
  isLecturerApproved?: boolean;

  @Column({ nullable: true, default: null })
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

  static async createOrUpdateAllocation(newRecord: Allocation) {
    let found = await Allocation.createQueryBuilder("allocation")
      .where("allocation.staffId = :id", { id: newRecord.staffId })
      .andWhere("allocation.activityId = :activityId", {
        activityId: newRecord.activityId,
      })
      .getOne();

    if (found) {
      return newRecord;
    } else {
      return Allocation.save(newRecord);
    }
  }
}

//Things to consider:
//find a way to allow lectruers to decide the offer expiry date, else the default value is 7 days
