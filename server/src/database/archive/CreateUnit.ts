import { Connection, getManager } from "typeorm";
import { Factory } from "typeorm-seeding";
import { Unit } from "src/entity/Unit";

export default class CreateUnit {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const manager = getManager();
    let unit = manager.create(Unit, {
      unitCode: "FIT3170",
      offeringPeriod: "Full Year",
      campus: "CL",
      year: 2020,
      aqfTarget: 3,
      activities: [],
      staffPreference: [],
    });

    await manager.save(unit);
  }
}
