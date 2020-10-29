import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { Activity } from "./activity";
import {Staff} from "./staff";

@Entity()
export class Allocation {

    @ManyToOne(() => Staff, staff => staff.allocations, {primary: true})
    @JoinColumn({name: "staff_id", referencedColumnName: "id"})
    staff!: Staff;

    @ManyToOne(() => Activity, activity => activity.allocations, {primary: true})
    @JoinColumn({name: "activity_code", referencedColumnName: "activity_code"})
    activity!: Activity;

    @PrimaryColumn({
        type: "char",
        length: 7
    })
    unit_code!: string;

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


}