import {
  BaseEntity,
  OneToOne,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  Column,
} from "typeorm";
import { Allocation } from ".";
import { Activity } from "./Activity";

@Entity()
export class Swap extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => Allocation)
  from!: Allocation;

  @Column({ nullable: false })
  fromAllocationId!: String;

  @ManyToOne(() => Activity, (activity) => activity.swaps)
  desired!: Activity;

  @Column({ nullable: false })
  desiredActivityId!: String;

  @OneToOne(() => Allocation)
  into!: Allocation;

  @Column({ nullable: true })
  intoAllocationId!: String;
}
