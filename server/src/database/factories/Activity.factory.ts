import * as Faker from "faker";
import { define } from "typeorm-seeding";
import { DayOfWeek } from "../../enums/DayOfWeek";
import { Activity, Unit } from "../../entity";

define(Activity, (faker: typeof Faker) => {
  const activity = new Activity();
  activity.id = faker.random.uuid();
  activity.activityCode = faker.fake("{{random.alphaNumeric(5)}}"); // TODO: format
  activity.activityGroup = "Workshop";
  activity.campus = "CL";
  activity.dayOfWeek = DayOfWeek.MONDAY;
  activity.location = faker.address.streetAddress();
  // activity.startTime = faker.time.recent().toString(); // TODO: fix
  activity.startTime = "18:00"; // TODO: fix
  activity.duration = faker.random.number(3) + 1;
  activity.unit = new Unit(); // Override this
  return activity;
});
