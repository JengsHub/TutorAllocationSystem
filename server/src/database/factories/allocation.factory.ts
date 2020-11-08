import * as Faker from "faker"
import { define } from "typeorm-seeding"
import { Activity, Allocation, Staff } from "../../entity"

define(Allocation, (faker: typeof Faker) => {
    const allocation = new Allocation()
    allocation.id = faker.random.uuid()
    allocation.staff = new Staff(); // This should always be overridden.
    allocation.activity = new Activity();
    return allocation
});