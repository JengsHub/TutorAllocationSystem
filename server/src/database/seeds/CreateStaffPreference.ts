import { Connection, getManager, getRepository } from "typeorm";
import { Factory } from "typeorm-seeding";
import { StaffPreference } from "src/entity/StaffPreference";
import { Staff, Unit } from "../../entity/index"

export default class CreateStaffPreference  {
  staff?: Staff;
  staffId: string;
  unit?: Unit;
  unitId: string;
  
	constructor(unitId: string, staffId: string) {
    this.unit;
    this.unitId = unitId;
    this.staff;
    this.staffId = staffId;
	}

	async getUnit(unitId: string) {
	const repo = getRepository(Unit);
  return await repo.findOneOrFail({id: unitId})
    .then(result => {
      if (!result) {
        throw result
      } else {
        return result;
      }
	  });
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
		let staffpreference = manager.create(StaffPreference,  {
      preferenceScore: 2,
      lecturerScore: 3,
      isHeadTutorCandidate: true,
      unit: this.unit,
			staff: this.staff
		}); 
		await manager.save(staffpreference);
		}
}