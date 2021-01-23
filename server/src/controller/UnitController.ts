import { getRepository } from "typeorm";
import { Staff, Unit, Activity } from "~/entity";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import { UnauthorisedAccessedError } from "~/helpers/shortcuts";

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
  getUnitActivities(unit: Unit): any;
  createUnit(newRecord: Unit): any;
  updateUnit(changedUnit: Unit): any;
  deleteUnit(id: string): any;
}

class TaUnitController implements IUnitController {
  async getUnitActivities(unit: Unit) {
    let activities = await getRepository(Activity).find({
      where: { unit: unit },
      relations: ["allocations"],
    });
    for (let activity of activities) {
      for (let allocation of activity.allocations) {
        let staff = await getRepository(Staff).findOne(allocation.staffId);
        if (staff) allocation.staff = staff;
      }
    }
    return activities;
  }

  async createUnit(newRecord: Unit) {
    return new UnauthorisedAccessedError("TA cannot create a unit");
  }

  async updateUnit(changedUnit: Unit) {
    return new UnauthorisedAccessedError("TA cannot update a unit");
  }

  deleteUnit(id: string) {
    return new UnauthorisedAccessedError("TA cannot delete a unit");
  }
}

class LecturerUnitController implements IUnitController {
  async getUnitActivities(unit: Unit) {
    let activities = await getRepository(Activity).find({
      where: { unit: unit },
      relations: ["allocations"],
    });
    for (let activity of activities) {
      for (let allocation of activity.allocations) {
        let staff = await getRepository(Staff).findOne(allocation.staffId);
        if (staff) allocation.staff = staff;
      }
    }
    return activities;
  }

  async createUnit(newRecord: Unit) {
    return new UnauthorisedAccessedError("Lecturers cannot create a unit");
  }

  async updateUnit(changedUnit: Unit) {
    let unitToUpdate = await Unit.findOne({
      id: changedUnit.id,
    });
    unitToUpdate = changedUnit;
    return Unit.save(unitToUpdate);
  }

  deleteUnit(id: string) {
    return new UnauthorisedAccessedError("Lecturers cannot delete a unit");
  }
}

class AdminUnitController implements IUnitController {
  async getUnitActivities(unit: Unit) {
    let activities = await getRepository(Activity).find({
      where: { unit: unit },
      relations: ["allocations"],
    });
    for (let activity of activities) {
      for (let allocation of activity.allocations) {
        let staff = await getRepository(Staff).findOne(allocation.staffId);
        if (staff) allocation.staff = staff;
      }
    }
    return activities;
  }

  async createUnit(newRecord: Unit) {
    let unitToUpdate = await Unit.findOne({
      unitCode: newRecord.unitCode,
      offeringPeriod: newRecord.offeringPeriod,
      year: newRecord.year,
    });
    if (unitToUpdate) {
      Unit.update({ id: unitToUpdate.id }, newRecord);
      newRecord.id = unitToUpdate.id;
      return newRecord;
    }
    return Unit.save(newRecord);
  }

  async updateUnit(changedUnit: Unit) {
    let unitToUpdate = await Unit.findOne({
      id: changedUnit.id,
    });
    unitToUpdate = changedUnit;
    return Unit.save(unitToUpdate);
  }

  deleteUnit(id: string) {
    return Unit.delete({
      id: id,
    });
  }
}
