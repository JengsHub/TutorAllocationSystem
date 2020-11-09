import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
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

  @RelationId((staffpref:StaffPreference)=>staffpref.staff)
  staffId!: string;

  @ManyToOne(() => Unit, { primary: true })
  unit!: Unit;

  @RelationId((staffpref:StaffPreference)=>staffpref.unit)
  unitId!: string;
}
