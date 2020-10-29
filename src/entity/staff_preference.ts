import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {Staff} from "./staff";
import {Unit} from "./unit";

@Entity()
export class Staff_Preference {

    @ManyToOne(() => Staff, staff => staff.staff_preference, {primary: true})
    @JoinColumn({name: "staff_id", referencedColumnName: "id"})
    staff!: Staff;

    @ManyToOne(() => Unit, {primary: true})
    @JoinColumn([
        {name: "unit_code", referencedColumnName: "unit_code"},
        {name: "offering_period", referencedColumnName: "offering_period"}])
    unit!: Unit;


    @Column({type: "int"})
    perference_score!: number;

    @Column({type: "int"})
    lecturer_score!: number;

    @Column({type: "boolean"})
    is_head_tutor_candidate!: boolean
}