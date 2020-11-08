import { Connection, getManager } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { Staff } from "src/entity/Staff";

export default class CreateStaff {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const manager = getManager();
    let staff = manager.create(Staff, {
      givenNames: "seedStaffGiven",
      lastName: "seedStaffLast",
      aqf: 8,
      studyingAqf: 9,
      email: "testEmail@service.com",
      allocations: [],
      staffPreference: [],
      availability: [],
    });

    await manager.save(staff);
  }
}
