import { Connection, getManager, getRepository } from "typeorm";
import { Factory } from "typeorm-seeding";
import { Allocation, Staff, Activity } from "../../entity/index";
import { DayOfWeek } from "../../enums/DayOfWeek";

export default class CreateAllocation {
  staff?: Staff;
  staffId: string;
  activity?: Activity;
  activityId: string;

  constructor(activityId: string, staffId: string) {
    this.activity;
    this.activityId = activityId;
    this.staff;
    this.staffId = staffId;
  }

  async getActivity(activityId: string) {
    const repo = getRepository(Activity);
    return await repo.findOneOrFail({ id: activityId }).then((result) => {
      if (!result) {
        throw result;
      } else {
        return result;
      }
    });
  }

  async getStaff(staffId: string) {
    const repo = getRepository(Staff);
    return await repo.findOneOrFail({ id: staffId }).then((result) => {
      if (!result) {
        throw result;
      } else {
        return result;
      }
    });
  }

  async run(factory: Factory, connection: Connection): Promise<void> {
    this.staff = await this.getStaff(this.staffId);

    const manager = getManager();
    let allocation = manager.create(Allocation, {
      activity: this.activity,
      staff: this.staff,
    });
    await manager.save(allocation);
  }
}
