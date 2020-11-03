import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Staff } from "./staff";
import { Unit } from "./unit";

@Entity()
export class StaffPreference {
  @ManyToOne(() => Staff, (staff) => staff.staffPreference, { primary: true })
  @JoinColumn({ name: "staffId", referencedColumnName: "id" })
  staff!: Staff;

  @ManyToOne(() => Unit, { primary: true })
  @JoinColumn([
    { name: "unitCode", referencedColumnName: "unitCode" },
    { name: "offeringPeriod", referencedColumnName: "offeringPeriod" },
  ])
  unit!: Unit;

  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column({ type: "int" })
  preferenceScore!: number;

  @Column({ type: "int" })
  lecturerScore!: number;

  @Column({ type: "boolean" })
  isHeadTutorCandidate!: boolean;
}
