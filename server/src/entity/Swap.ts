import {
  BaseEntity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
} from "typeorm";
import { Allocation } from ".";
import { Activity } from "./Activity";

@Entity()
export class Swap extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => Allocation)
  @JoinColumn({ name: "allocationFrom" })
  from!: Allocation;

  @ManyToOne(() => Activity, (activity) => activity.swaps)
  desired!: Activity;

  @OneToOne(() => Allocation)
  @JoinColumn({ name: "allocationInto" })
  into!: Allocation;
}
