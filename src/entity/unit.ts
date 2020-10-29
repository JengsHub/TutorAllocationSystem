import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {Activity} from "./activity";
import {Staff_Preference} from "./staff_preference";

@Entity()
export class Unit {

    @PrimaryColumn({
        type: "char",
        length: 7
    })
    unit_code!: string;

    @PrimaryColumn({
        type: "varchar"
    })
    offering_period!: string;


    @Column({
        type: "char",
        length: 2
    })
    campus!: string;

    @Column({type: "int"})
    aqf_target!: number;

    @OneToMany(() => Activity, activity => activity.unit)
    activities!: Activity[];

    @OneToMany(() => Staff_Preference, staff_preference => staff_preference.unit)
    staff_preference!: Staff_Preference[]
}