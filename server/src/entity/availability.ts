import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {Staff} from "./staff";

@Entity()
export class Availability {

    @ManyToOne(() => Staff, staff => staff.availability, {primary: true})
    staff!: Staff;

    @Column({type: "time"})
    time_ranges!: number;

    @Column({type: "int"})
    max_hours!: number;

    @Column({type: "int"})
    max_number_activities!: number;

}