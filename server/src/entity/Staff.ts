import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AppRoleEnum } from "~/enums/RoleEnum";
import { Unit } from ".";
import { Allocation } from "./Allocation";
import { Availability } from "./Availability";
import { Role } from "./Role";
import { StaffPreference } from "./StaffPreference";
import { StatusLog } from "./StatusLog";

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

  @OneToMany(() => StatusLog, (statusLog) => statusLog.offeror)
  offerorStatusLog!: StatusLog[];

  @OneToMany(() => StatusLog, (statusLog) => statusLog.staff)
  offereeStatusLog!: StatusLog[];

  @Column({ nullable: true })
  googleId?: string;

  @OneToMany(() => Role, (role) => role.staff)
  roles!: Role[];

  @Column({ default: AppRoleEnum.USER })
  appRole!: AppRoleEnum;

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

  isAdmin() {
    return this.appRole === AppRoleEnum.ADMIN;
  }
}
