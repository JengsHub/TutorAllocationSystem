import * as Faker from "faker";
import { define } from "typeorm-seeding";
import { Unit } from "../../entity";

define(Unit, (faker: typeof Faker) => {
  faker.seed(0);

  const unit = new Unit();
  unit.id = faker.random.uuid();
  unit.unitCode = `FIT${faker.random.number(3000) + 1000}`;
  unit.offeringPeriod = `S${faker.random.number(1) + 1}`;
  unit.campus = "CL";
  unit.year = 2020;
  unit.aqfTarget = faker.random.number(10);
  return unit;
});
