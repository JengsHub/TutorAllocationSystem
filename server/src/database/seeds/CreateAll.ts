import { Connection, getManager } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import {
  Activity,
  Allocation,
  Availability,
  Role,
  Rule,
  Staff,
  StaffPreference,
} from "~/entity";
import { DayOfWeek } from "~/enums/DayOfWeek";
import { RoleEnum } from "~/enums/RoleEnum";
import { Unit } from "../../entity/Unit";
import { defaultRules } from "../../helpers/defaultRules";

export default class CreateAll implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const manager = getManager();
    await manager.transaction(async (manager) => {
      // Create two staff
      let staffOne = manager.create(Staff, {
        givenNames: "Staff",
        lastName: "One",
        aqf: 8,
        studyingAqf: 9,
        email: "staffone@service.com",
        allocations: [],
        staffPreference: [],
        availability: [],
      });

      await manager.save(staffOne);

      let staffTwo = manager.create(Staff, {
        givenNames: "Staff",
        lastName: "Two",
        aqf: 6,
        studyingAqf: 7,
        email: "stafftwo@service.com",
        allocations: [],
        staffPreference: [],
        availability: [],
      });

      await manager.save(staffTwo);

      // Create one unit
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

      // Create two staff preferences
      let staffpreferenceOne = manager.create(StaffPreference, {
        preferenceScore: 2,
        lecturerScore: 3,
        isHeadTutorCandidate: true,
        unit: unit,
        staff: staffOne,
      });
      await manager.save(staffpreferenceOne);

      let staffPreferenceTwo = manager.create(StaffPreference, {
        preferenceScore: 1,
        lecturerScore: 1,
        isHeadTutorCandidate: false,
        unit: unit,
        staff: staffTwo,
      });
      await manager.save(staffPreferenceTwo);

      // Create two activities
      let activityOne = manager.create(Activity, {
        activityCode: "01-P1",
        activityGroup: "Workshop",
        campus: "CL",
        location: "123 Seed Local",
        dayOfWeek: DayOfWeek.MONDAY,
        startTime: "13:00",
        endTime: "17:00",
        allocations: [],
        unit: unit,
      });
      await manager.save(activityOne);

      let activityTwo = manager.create(Activity, {
        activityCode: "02-P2",
        activityGroup: "Tutorial",
        campus: "CL",
        location: "123 Seed Local",
        dayOfWeek: DayOfWeek.TUESDAY,
        startTime: "13:00",
        endTime: "15:00",
        allocations: [],
        unit: unit,
      });
      await manager.save(activityTwo);

      let activityThree = manager.create(Activity, {
        activityCode: "03-P2",
        activityGroup: "Tutorial",
        campus: "CL",
        location: "123 Seed Local",
        dayOfWeek: DayOfWeek.MONDAY,
        startTime: "17:00",
        endTime: "23:00",
        allocations: [],
        unit: unit,
      });
      await manager.save(activityThree);

      let availabilities = [
        {
          day: DayOfWeek.MONDAY,
          startTime: "08:00",
          endTime: "18:00",
          year: 2020,
          maxHours: 6,
          maxNumberActivities: 2,
          staff: staffOne,
        },
        {
          day: DayOfWeek.TUESDAY,
          startTime: "08:00",
          endTime: "18:00",
          year: 2020,
          maxHours: 6,
          maxNumberActivities: 2,
          staff: staffTwo,
        },
        {
          day: DayOfWeek.TUESDAY,
          startTime: "08:00",
          endTime: "18:00",
          year: 2020,
          maxHours: 6,
          maxNumberActivities: 2,
          staff: staffOne,
        },
        {
          day: DayOfWeek.MONDAY,
          startTime: "08:00",
          endTime: "18:00",
          year: 2020,
          maxHours: 6,
          maxNumberActivities: 2,
          staff: staffTwo,
        },
      ];

      // Create two availabilities
      for (let availability of availabilities) {
        let a = manager.create(Availability, availability);
        await manager.save(a);
      }
      // Create one allocation
      let allocationOne = manager.create(Allocation, {
        activity: activityOne,
        staff: staffOne,
      });
      allocationOne.isWorkforceApproved = true;
      await manager.save(allocationOne);

      for (const r of defaultRules) {
        let rule = manager.create(Rule, r);
        await manager.save(rule);
      }

      let role = manager.create(Role, {
        title: RoleEnum.LECTURER,
        staff: staffOne,
        unit: unit,
      });
      await manager.save(role);
    });
  }
}
