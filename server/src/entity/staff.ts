import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Allocation} from "./allocation";
import {Staff_Preference} from "./staff_preference";
import {Availability} from "./availability";

@Entity()
export class Staff {

    @PrimaryGeneratedColumn("uuid")
    id!: number;


    @Column({
        type: "text"
    })
    given_names!: string;

    @Column({
        type: "text"
    })
    last_name!: string;

    @Column({type: "int"})
    aqf!: number;

    @Column({type: "int"})
    studying_aqf!: number;

    @Column({
        type: "text",
        unique: true
    })
    email!: string;

    @OneToMany(() => Allocation, allocation => allocation.staff)
    allocations!: Allocation[];

    @OneToMany(() => Staff_Preference, staff_preference => staff_preference.staff)
    staff_preference!: Staff_Preference[];

    @OneToMany(() => Availability, availability => availability.staff)
    availability!: Availability[];
}