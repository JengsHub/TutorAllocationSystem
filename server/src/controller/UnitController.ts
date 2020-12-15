import { getRepository } from "typeorm";
import { Staff, Unit, Activity } from "~/entity";
import { RoleEnum } from "~/enums/RoleEnum";

export class UnitControllerFactory {
  getController(role: RoleEnum): IUnitController {
    switch (role) {
      case RoleEnum.TA:
        return new TaUnitController();
      case RoleEnum.LECTURER:
        return new LecturerUnitController();
      case RoleEnum.ADMIN:
        return new AdminUnitController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IUnitController {
  getUnits(user: Staff): Promise<Unit[]>;
  getActivities(unit: Unit, user: Staff): Promise<Activity[]>;
}

class TaUnitController implements IUnitController {
  getUnits(user: Staff): Promise<Unit[]> {
    throw new Error("Method not implemented.");
  }

  async getActivities(unit: Unit, user: Staff): Promise<Activity[]> {
    let activities = await Activity.find({
      relations: ["allocations"],
      where: {
        unitId: unit.id,
      },
    });

    // Filter out activities that do not have the staff allocated to them
    activities = activities.filter((activity) => {
      const allocations = activity.allocations.filter(
        (allocation) => allocation.staffId == user.id
      );
      activity.allocations = allocations;
      return allocations.length > 0;
    });

    return activities;
  }
}

class LecturerUnitController implements IUnitController {
  getUnits(user: Staff): Promise<Unit[]> {
    throw new Error("Method not implemented.");
  }
  getActivities(unit: Unit, user: Staff): Promise<Activity[]> {
    let activites = getRepository(Activity).find({
      where: {unit: unit}
    });
    return activites;
  }
}

class AdminUnitController implements IUnitController {
  getUnits(user: Staff): Promise<Unit[]> {
    throw new Error("Method not implemented.");
  }
  getActivities(unit: Unit, user: Staff): Promise<Activity[]> {
    throw new Error("Method not implemented.");
  }
}
