import { Connection, getManager } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { Staff } from "src/entity/Staff";
import { Unit } from "~/entity/Unit";

export default class CreateAll implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const manager = getManager();
    let staff = manager.create(Staff,  {
        givenNames: "Sara",
        lastName: "Tran",
        aqf: 3,
        studyingAqf: 4,
        email: "sara2@gmail.com",
        allocations: [],
        staffPreference: [],
        availability: [],
      }); // same as const staff = new Staff(); staff.givenNames = "Sara"; staff.lastName = "Tran"; etc.

    await manager.save(staff);

    let unit = manager.create(Unit, {
        unitCode: "FIT3170",
        offeringPeriod: "S2-2020",
        campus: "CL",
        year: 2020,
        aqfTarget: 3,
        activities: [],
        staffPreference: []
    })

    await manager.save(unit);
    // // Note: do we need transaction?
    // await manager.transaction(async transactionalManager => {
    //     let staff = transactionalManager.create(Staff,  {
    //         givenNames: "Sara",
    //         lastName: "Tran",
    //         aqf: 3,
    //         studyingAqf: 4,
    //         email: "sara@gmail.com",
    //         allocations: [],
    //         staffPreference: [],
    //         availability: [],
    //       }); // same as const staff = new Staff(); staff.givenNames = "Sara"; staff.lastName = "Tran"; etc.

    //     transactionalManager.save(staff);

    //     let unit = transactionalManager.create(Unit, {
    //         unitCode: "FIT3170",
    //         offeringPeriod: "S2-2020",
    //         campus: "CL",
    //         year: 2020,
    //         aqfTarget: 3,
    //         activities: [],
    //         staffPreference: []
    //     })

    //     transactionalManager.save(unit);

    // })
  }
}
