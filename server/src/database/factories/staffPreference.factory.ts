import * as Faker from "faker";
import { define } from "typeorm-seeding";
import { Staff, StaffPreference, Unit } from "../../entity";

define(StaffPreference, (faker: typeof Faker) => {
  const staffpreference = new StaffPreference();
  staffpreference.id = faker.random.uuid();
  staffpreference.preferenceScore = faker.random.number(4);
  staffpreference.lecturerScore = faker.random.number(3);
  staffpreference.isHeadTutorCandidate = faker.random.boolean();
  staffpreference.staff = new Staff(); // This should always be overridden.
  staffpreference.unit = new Unit();
  return staffpreference;
});
