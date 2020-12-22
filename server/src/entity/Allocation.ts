import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Column,
  getConnection,
} from "typeorm";
import { ApprovalEnum } from "~/enums/ApprovalEnum";
import { IAllocation } from "~/interfaces/typesInputEntites";
import { Activity } from "./Activity";
import { Staff } from "./Staff";

@Entity()
export class Allocation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // TODO: lec,staff,workforce Confirmation(s) booleans or Enum
  @Column({ default: ApprovalEnum.INIT })
  approval!: ApprovalEnum;

  @ManyToOne(() => Activity, (activity) => activity.allocations, {
    primary: true,
  })
  activity!: Activity;

  @RelationId((a: Allocation) => a.activity)
  activityId!: string;

  @ManyToOne(() => Staff, (staff) => staff.allocations, { primary: true })
  staff!: Staff;

  @RelationId((a: Allocation) => a.staff)
  staffId!: string;

  static async insertAllocationIntoDb(valueToInsert: IAllocation) {
    /**
     * Inserts new allocation item into database if not present, else update the existing allocation
     */
    // find whether current value is already in database
    var inDB = true;
    try {
      const allocation = await getConnection()
        .getRepository(Allocation)
        .createQueryBuilder("allocation")
        .where(
          "allocation.activityId = :activityId AND allocation.staffId = :staffId",
          {
            activityId: valueToInsert.activityId,
            staffId: valueToInsert.staffId,
          }
        )
        .getOneOrFail();
    } catch (EntityNotFoundError) {
      inDB = false;
      // insert activity row if entity not found in database
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Allocation)
        .values(valueToInsert)
        .execute();
    }

    // if already in db, do nothing since the only 2 values provided are also the key to find the particular value in the database which means they are the same and so no update is needed
  }
}
