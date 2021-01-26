import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Staff } from ".";
import { Allocation } from "./Allocation";

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

  @Column({nullable: true})
  targetStaffId?: string;

  @Column()
  action!: string;

  @Column() // Format: [DD/MM/YYYY hh:mm:ss]
  time!: string;
}
