import { Staff } from "src/entity/Staff";
import { Connection, getManager } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import {
  Activity,
  Allocation,
  Availability,
  StaffPreference,
  Rule,
} from "~/entity";
import { DayOfWeek } from "~/enums/DayOfWeek";
import { Unit } from "../../entity/Unit";
import { defaultRules } from "../../helpers/defaultRules";

export default class CreateAll implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const manager = getManager();
    await manager.transaction(async (manager) => {
      let staff = manager.create(Staff, {
        givenNames: "seedStaffGiven",
        lastName: "seedStaffLast",
        aqf: 8,
        studyingAqf: 9,
        email: "testEmail@service.com",
        allocations: [],
        staffPreference: [],
        availability: [],
      }); // same as const staff = new Staff(); staff.givenNames = "Sara"; staff.lastName = "Tran"; etc.

      await manager.save(staff);

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

      let staffpreference = manager.create(StaffPreference, {
        preferenceScore: 2,
        lecturerScore: 3,
        isHeadTutorCandidate: true,
        unit: unit,
        staff: staff,
      });
      await manager.save(staffpreference);

      let activity = manager.create(Activity, {
        activityCode: "01-P1",
        activityGroup: "Workshop",
        campus: "CL",
        location: "123 Seed Local",
        duration: 3,
        dayOfWeek: DayOfWeek.MONDAY,
        startTime: "13:00",
        allocations: [],
        unit: unit,
      });
      await manager.save(activity);

      let availability = manager.create(Availability, {
        day: DayOfWeek.TUESDAY,
        startTime: "08:00",
        endTime: "18:00",
        year: 2020,
        maxHours: 6,
        maxNumberActivities: 2,
        staff: staff,
      });
      await manager.save(availability);

      let allocation = manager.create(Allocation, {
        activity: activity,
        staff: staff,
      });
      await manager.save(allocation);

      for (const r of defaultRules) {
        let rule = manager.create(Rule, r);
        await manager.save(rule);
      }
    });
  }
}
