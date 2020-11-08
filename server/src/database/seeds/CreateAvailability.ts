import { Connection, getManager, getRepository } from "typeorm";
import { Factory } from "typeorm-seeding";
import { Availability } from "src/entity/Availability";
import { Staff } from "src/entity/Staff";
import { DayOfWeek } from "../../enums/DayOfWeek"

export default class CreateAvailability  {
  staff?: Staff;
  staffId: string;
  
	constructor(staffId: string) {
    this.staff;
    this.staffId = staffId;
	}

	async getStaff(staffId: string) {
	const repo = getRepository(Staff);
  return await repo.findOneOrFail({id: staffId})
    .then(result => {
      if (!result) {
        throw result
      } else {
        return result;
      }
	  });
	}

	async run(factory: Factory, connection: Connection): Promise<void> {
		this.staff = await this.getStaff(this.staffId);

		const manager = getManager();
		let availability = manager.create(Availability,  {
      day: DayOfWeek.TUESDAY,
      startTime: 800,
      endTime: 1800,
      year: 2020,
      maxHours: 6,
      maxNumberActivities: 2,
			staff: this.staff
		}); 
		await manager.save(availability);
		}
}