import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Staff } from "./Staff";
import { Unit } from "./Unit";

@Entity()
export class StaffPreference {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  preferenceScore!: number;

  @Column()
  lecturerScore!: number;

  @Column()
  isHeadTutorCandidate!: boolean;

  @ManyToOne(() => Staff, (staff) => staff.staffPreference, { primary: true })
  staff!: Staff;

  @ManyToOne(() => Unit, { primary: true })
  unit!: Unit;
}
