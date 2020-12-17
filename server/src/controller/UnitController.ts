import { getRepository } from "typeorm";
import { Staff, Unit, Activity } from "~/entity";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";

export class UnitControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IUnitController {
    switch (role) {
      case RoleEnum.TA:
        return new TaUnitController();
      case RoleEnum.LECTURER:
        return new LecturerUnitController();
      case AppRoleEnum.ADMIN:
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
  async getActivities(unit: Unit, user: Staff): Promise<Activity[]> {
    let activites = await getRepository(Activity).find({
      where: { unit: unit },
      relations: ["allocations"],
    });
    for (let activity of activites) {
      for (let allocation of activity.allocations) {
        let staff = await getRepository(Staff).findOne(allocation.staffId);
        if (staff) allocation.staff = staff;
      }
    }
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
