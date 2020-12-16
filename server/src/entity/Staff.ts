import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
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
    console.log(role);
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
}
