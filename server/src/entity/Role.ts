import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Staff } from ".";
import { RoleEnum } from "../enums/RoleEnum";
import { Unit } from "./Unit";

@Entity()
@Unique(["unitId", "staffId"])
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: RoleEnum;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: "unitId" })
  unit!: Unit;

  @Column()
  unitId!: string;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: "staffId" })
  staff!: Staff;

  @Column()
  staffId!: string;
}
