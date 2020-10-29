import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { Unit } from "./unit";
import {Allocation} from "./allocation";

@Entity()
export class Activity {

    @PrimaryColumn({
        type: "varchar"
    })
    activity_code!: string;

    @ManyToOne(() => Unit, unit => unit.activities, {primary: true})
    @JoinColumn({name: "unit_code", referencedColumnName: "unit_code"})
    unit!: Unit;

    @PrimaryColumn({
        type: "varchar"
    })
    offering_period!: string;


    @Column({type: "varchar"})
    activity_group!: string;

    @Column({
        type: "varchar",
        length: 2
    })
    campus!: string;

    @Column({type: "varchar"})
    location!: string;

    @Column({type: "int"})
    duration!: number;

    @Column({
        type: "varchar",
        length: 3
    })
    day_of_week!: number;

    @Column({type: "time"})
    start_time!: Date;

    @OneToMany(() => Activity, activity => activity.allocations)
    allocations!: Allocation[]

}