import {
  BaseEntity,
  Column,
  Entity,
  getConnection,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AppRoleEnum } from "~/enums/RoleEnum";
import { IStaff } from "~/interfaces/typesInputEntites";
import { Unit } from ".";
import { Allocation } from "./Allocation";
import { Availability } from "./Availability";
import { Role } from "./Role";
import { StaffPreference } from "./StaffPreference";

@Entity()
export class Staff extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  givenNames!: string;

  @Column({ nullable: true })
  lastName!: string;

  @Column({ nullable: true })
  aqf!: number;

  @Column({ nullable: true })
  studyingAqf!: number;

  @Column({
    type: "text",
    unique: true,
  })
  email!: string;

  @OneToMany(() => Allocation, (allocation) => allocation.staff)
  allocations!: Allocation[];

  @OneToMany(() => StaffPreference, (staffPreference) => staffPreference.staff)
  staffPreference!: StaffPreference[];

  @OneToMany(() => Availability, (availability) => availability.staff)
  availability!: Availability[];

  @Column({ nullable: true })
  googleId?: string;

  @OneToMany(() => Role, (role) => role.staff)
  roles!: Role[];

  @Column({ default: AppRoleEnum.USER })
  appRole!: AppRoleEnum;

  async getRoleForUnit(unit: Unit) {
    // if (this.isAdmin) return { title: AppRoleEnum.ADMIN, staffId: this.id };
    const role = await Role.findOneOrFail({
      where: {
        staffId: this.id,
        unitId: unit.id,
      },
    });
    return role;
  }

  async getRoleTitle(unitId?: string) {
    if (this.isAdmin()) return AppRoleEnum.ADMIN;

    // TODO: handle list of roles
    const role = await Role.findOneOrFail({
      where: {
        staffId: this.id,
        unitId: unitId,
      },
    });
    return role.title;
  }
  async getRoles() {
    // if (this.isAdmin) return [{ title: AppRoleEnum.ADMIN, staffId: this.id }];
    const roles = await Role.find({
      where: {
        staffId: this.id,
      },
    });
    return roles;
  }

  isAdmin() {
    return this.appRole === AppRoleEnum.ADMIN;
  }

  static async insertStaffIntoDb(valueToInsert: IStaff) {
    /**
     * Inserts new staff item into database if not present, else update the existing staff
     * returns staff that was inserted or updated
     */
    // find whether current value is already in database
    var inDB = true;
    try {
      await getConnection()
        .getRepository(Staff)
        .createQueryBuilder("staff")
        .where("staff.email = :email", { email: valueToInsert.email })
        .getOneOrFail();
    } catch (EntityNotFoundError) {
      inDB = false;
      // insert new staff row if entity not found in database
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Staff)
        .values(valueToInsert)
        .execute();
    }

    if (inDB) {
      // if already in db, then just update all the values
      await getConnection()
        .createQueryBuilder()
        .update(Staff)
        .set({
          givenNames: valueToInsert.givenNames,
          lastName: valueToInsert.lastName,
          aqf: valueToInsert.aqf,
          studyingAqf: valueToInsert.studyingAqf,
        })
        .where("email = :email", { email: valueToInsert.email })
        .execute();
    }

    const staff = await getConnection()
      .getRepository(Staff)
      .createQueryBuilder("staff")
      .where("staff.email = :email", { email: valueToInsert.email })
      .getOne();

    return staff;
  }
}
