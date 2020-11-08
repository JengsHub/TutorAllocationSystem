import { DBConnect } from "../../helpers/db";
import { Staff, Unit, Activity, Allocation, Availability, StaffPreference, } from "../index";
import { factory, useSeeding, useRefreshDatabase } from "typeorm-seeding";


// Use to provide to other models, and use ID in fetch/delete
let staff: Staff;
let unit: Unit;
let activity: Activity;
let availability: Availability;
let staffPreference: StaffPreference;
let allocation: Allocation;

describe("Create Entity Tests", () => {
   
    beforeAll(async () => {
        await DBConnect()
        await useSeeding();
    });

    describe("Test Models Creation", () => {

        describe("Base (zero) Level Models", () => {
            test("Can build new Staff", async () => {
                staff = await factory(Staff)().make();
            });
    
            test("Can build new Unit", async () => {
                unit = await factory(Unit)().make();
            });
        });

        describe("First level of Models", () => {
            test("Can build new Acivity", async () => {
                activity = await factory(Activity)().make()
            });
    
            test("Can build new Availability", async () => {
                availability = await factory(Availability)().make();
            });
    
            test("Can build new StaffPreference", async () => {
                staffPreference = await factory(StaffPreference)().make()
            });
        });
        
        describe("Second level of Models", () => {
            test("Can build new Allocation", async () => {
                allocation = await factory(Allocation)().make()
            });
        });
    });
});