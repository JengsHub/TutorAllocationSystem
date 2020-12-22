import {
  BaseEntity,
  Column,
  Entity,
  getConnection,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { IStaffPreference } from "~/interfaces/typesInputEntites";
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

  @RelationId((staffpref: StaffPreference) => staffpref.staff)
  staffId!: string;

  @ManyToOne(() => Unit, { primary: true })
  unit!: Unit;

  @RelationId((staffpref: StaffPreference) => staffpref.unit)
  unitId!: string;

  static async insertStaffPreferencesIntoDb(valueToInsert: IStaffPreference) {
    /**
     * Inserts new staff preference item into database if not present, else update the existing staff preference
     */
    // find whether current value is already in database
    var inDB = true;
    try {
      const user = await getConnection()
        .getRepository(StaffPreference)
        .createQueryBuilder("staff_pref")
        .where(
          "staff_pref.staffId = :staffId AND staff_pref.unitId = :unitId",
          { staffId: valueToInsert.staffId, unitId: valueToInsert.unitId }
        )
        .getOneOrFail();
    } catch (EntityNotFoundError) {
      inDB = false;
      // insert new staff preference row if entity not found in database
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(StaffPreference)
        .values(valueToInsert)
        .execute();
    }

    if (inDB) {
      // if already in db, then just update all the values
      await getConnection()
        .createQueryBuilder()
        .update(StaffPreference)
        .set({
          preferenceScore: valueToInsert.preferenceScore,
          lecturerScore: valueToInsert.lecturerScore,
          isHeadTutorCandidate: valueToInsert.isHeadTutorCandidate,
        })
        .where(
          "staff_pref.staffId = :staffId AND staff_pref.unitId = :unitId",
          { staffId: valueToInsert.staffId, unitId: valueToInsert.unitId }
        )
        .execute();
    }
  }
}
