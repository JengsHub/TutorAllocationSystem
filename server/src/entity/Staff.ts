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

  async getRoleForUnit(unit: Unit) {
    const role = await Role.findOneOrFail({
      where: {
        staffId: this.id,
        unitId: unit.id,
      },
    });
    console.log(role);
    return role;
  }

  async getRoles() {
    const role = await Role.find({
      where: {
        staffId: this.id,
      },
    });
    return role;
  }
}
