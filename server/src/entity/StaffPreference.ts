import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Staff } from "./Staff";
import { Unit } from "./Unit";

@Entity()
export class StaffPreference extends BaseEntity {
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

  @Column()
  staffId!: string;

  @ManyToOne(() => Unit, { primary: true })
  unit!: Unit;

  @Column()
  unitId!: string;

  static async createOrUpdateStaffPreference(newRecord: StaffPreference) {
    let staff = await Staff.findOneOrFail({
      id: newRecord.staffId,
    });
    let unit = await Unit.findOneOrFail({
      id: newRecord.unitId,
    });
    let staffPreferenceToUpdate = await StaffPreference.findOne({
      staff: staff,
      unit: unit,
    });
    if (staffPreferenceToUpdate) {
      StaffPreference.update({ id: staffPreferenceToUpdate.id }, newRecord);
      newRecord.staff = staff;
      newRecord.unit = unit;
      return newRecord;
    }

    newRecord.staff = staff;
    newRecord.unit = unit;

    return StaffPreference.save(StaffPreference.create(newRecord));
  }
}
