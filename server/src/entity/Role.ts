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
import { RoleEnum } from "~/enums/RoleEnum";
import { Staff } from ".";
import { Unit } from "./Unit";

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: RoleEnum;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: "unitId" })
  unit!: Unit;

  @Column({ nullable: true })
  unitId!: string;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: "staffId" })
  staff!: Staff;

  @Column()
  staffId!: string;
}
