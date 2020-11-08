import { Connection, getManager, getRepository } from "typeorm";
import { Factory } from "typeorm-seeding";
import { Activity } from "src/entity/Activity";
import { DayOfWeek } from "../../enums/DayOfWeek";
import { Unit } from "src/entity/Unit";

export default class CreateActivity {
  unit?: Unit;
  unitId: string;
  constructor(unitId: string) {
    this.unit;
    this.unitId = unitId;
  }

  async getUnit(unitId: string) {
    const repo = getRepository(Unit);
    return await repo.findOneOrFail({ id: unitId }).then((result) => {
      if (!result) {
        throw result;
      } else {
        return result;
      }
    });
  }

  async run(factory: Factory, connection: Connection): Promise<void> {
    this.unit = await this.getUnit(this.unitId);

    const manager = getManager();
    let activity = manager.create(Activity, {
      activityCode: "01-P1",
      activityGroup: "Workshop",
      campus: "CL",
      location: "123 Seed Local",
      duration: 3,
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: 1300,
      allocations: [],
      unit: this.unit,
    });
    await manager.save(activity);
  }
}
