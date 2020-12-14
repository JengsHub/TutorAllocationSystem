import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rule extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ readonly: true })
  ruleName!: string;

  @Column({ readonly: true })
  ruleDescription!: string;

  @Column()
  value!: number;
}
