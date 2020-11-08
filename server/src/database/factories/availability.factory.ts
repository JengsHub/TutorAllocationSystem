import * as Faker from "faker";
import { define } from "typeorm-seeding";
import { DayOfWeek } from "../../enums/DayOfWeek";
import { Availability, Staff } from "../../entity";

define(Availability, (faker: typeof Faker) => {
  const availability = new Availability();
  availability.id = faker.random.uuid();
  availability.day = DayOfWeek.MONDAY;
  availability.startTime = "8:00";
  availability.endTime = "16:00";
  availability.year = 2020;
  availability.maxHours = faker.random.number(5) + 3;
  availability.maxNumberActivities = faker.random.number(3) + 1;
  availability.staff = new Staff();
  return availability;
});
