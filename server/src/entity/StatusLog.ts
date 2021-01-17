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

  @Column()
  action!: string;

  @Column() // Format: [DD/MM/YYYY]
  time!: string;
}
