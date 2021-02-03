import * as Faker from "faker";
import { define } from "typeorm-seeding";
import { Activity, Unit } from "../../entity";
import { DayOfWeek } from "../../enums/DayOfWeek";

define(Activity, (faker: typeof Faker) => {
  const activity = new Activity();
  activity.id = faker.random.uuid();
  activity.activityCode = faker.fake("{{random.alphaNumeric(5)}}"); // TODO: format
  activity.activityGroup = "Workshop";
  activity.campus = "CL";
  activity.dayOfWeek = DayOfWeek.MONDAY;
  activity.location = faker.address.streetAddress();
  // activity.startTime = faker.time.recent().toString(); // TODO: fix
  activity.startTime = `${faker.random
    .number({
      min: 10,
      max: 16,
    })
    .toString()}:00`; // TODO: fix
  activity.endTime = `${faker.random
    .number({
      min: 17,
      max: 23,
    })
    .toString()}:00`;
  activity.unit = new Unit(); // Override this
  return activity;
});
