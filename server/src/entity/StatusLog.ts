import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Staff } from ".";
import { Allocation } from "./Allocation";
import { ActionEnums } from "../enums/ActionEnum";
import { createAndSaveStatusLog } from "~/helpers/statusLogHelper";

@Entity()
export class StatusLog extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Allocation, (allocation) => allocation.statusLog, {
    primary: true,
  })
  allocation!: Allocation;

  @Column()
  allocationId!: string;

  @ManyToOne(() => Staff, (staff) => staff.offereeStatusLog, { primary: true })
  staff!: Staff;

  @Column()
  staffId!: string;

  @ManyToOne(() => Staff, (staff) => staff.targetStatusLog, { primary: true })
  targetStaff!: Staff;

  @Column({ nullable: true })
  targetStaffId!: string | null;

  @Column()
  action!: string;

  @Column() // Format: [DD/MM/YYYY hh:mm:ss]
  time!: string;

  static async createOrIgnoreStatusLog(
    newRecord: Allocation,
    staffId: string,
    user: Staff
  ) {
    let found = StatusLog.createQueryBuilder("status")
      .where("status.allocationId = :id", { id: newRecord.id })
      .andWhere("status.targetStaffId = :staffId", { staffId })
      .andWhere("status.action = :action", {
        action: ActionEnums.WORKFORCE_PROPOSE,
      })
      .getOne();

    if (found) {
      createAndSaveStatusLog(
        newRecord["id"],
        ActionEnums.LECTURER_PROPOSE,
        user.id,
        staffId
      );
    }
  }
}
