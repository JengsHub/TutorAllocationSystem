import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { Unit } from "./unit";
import {Allocation} from "./allocation";

@Entity({name: "Activity"})
export class Activity {

    @PrimaryColumn({
        type: "varchar"
    })
    activityCode!: string;

    @ManyToOne(() => Unit, unit => unit.activities, {primary: true})
    @JoinColumn({name: "unit_code", referencedColumnName: "unit_code"})
    unit!: Unit;

    @PrimaryColumn({
        type: "varchar"
    })
    offeringPeriod!: string;


    @Column({type: "varchar"})
    activityGroup!: string;

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
    dayOfWeek!: number;

    @Column({type: "time"})
    startTime!: Date;

    @OneToMany(() => Activity, activity => activity.allocations)
    allocations!: Allocation[]

}