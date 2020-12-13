import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  ruleName!: string;

  @Column()
  value!: number;
}
