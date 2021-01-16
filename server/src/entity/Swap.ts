import {
  BaseEntity,
  OneToOne,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  Column,
  JoinColumn,
} from "typeorm";
import { Allocation } from ".";
import { Activity } from "./Activity";

@Entity()
export class Swap extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => Allocation)
  @JoinColumn({ name: "fromAllocationId" })
  from!: Allocation;

  @Column({ nullable: false })
  fromAllocationId!: String;

  @ManyToOne(() => Activity, (activity) => activity.swaps)
  desired!: Activity;

  @Column({ nullable: false })
  desiredActivityId!: String;

  @OneToOne(() => Allocation)
  @JoinColumn({ name: "intoAllocationId" })
  into!: Allocation;

  @Column({ nullable: true })
  intoAllocationId!: String;
}
