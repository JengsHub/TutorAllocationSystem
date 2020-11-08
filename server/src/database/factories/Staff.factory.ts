import * as Faker from "faker"
import { define } from "typeorm-seeding"
import { Staff } from "../../entity"

define(Staff, (faker: typeof Faker) => {
    const staff = new Staff()
    staff.id = faker.random.uuid()
    staff.givenNames = faker.name.firstName()
    staff.lastName = faker.name.lastName()
    staff.aqf = faker.random.number()
    staff.studyingAqf = staff.aqf + faker.random.number(2)
    staff.email = faker.internet.email()
    return staff
});