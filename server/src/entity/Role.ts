import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { RoleEnum } from "../enums/RoleEnum";
import { Staff } from ".";
import { Unit } from "./Unit";

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: RoleEnum;

  @ManyToOne(() => Unit)
  unit!: Unit;

  @RelationId((role: Role) => role.unit)
  unitId!: string;

  @ManyToOne(() => Staff)
  staff!: Staff;

  @RelationId((role: Role) => role.staff)
  staffId!: string;
}
