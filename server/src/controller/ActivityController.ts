import { Unit } from "~/entity";
import { Activity } from "~/entity/Activity";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import { UnauthorisedAccessedError } from "~/helpers/shortcuts";

export class ActivityControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IActivityController {
    switch (role) {
      case RoleEnum.TA:
        return new TaActivityController();
      case RoleEnum.LECTURER:
        return new LecturerActivityController();
      case AppRoleEnum.ADMIN:
        return new AdminActivityController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IActivityController {
  getAllActivities(): any;
  getActivity(activityId: string): any;
  getActivityForCandidates(activityId: string): any;
  getActivityForSortedCandidates(
    activityId: string,
    sortingCriteria: string
  ): any;
  createActivity(newRecord: Activity, unit: Unit): any;
  updateActivity(changedActivity: Activity): any;
  deleteActivity(activityId: string): any;
}

/* TA role authorisation - RESTRICTED ACCESS
 * - getActivity
 */

class TaActivityController implements IActivityController {
  getAllActivities() {
    return new UnauthorisedAccessedError("TA cannot get all activities");
  }

  getActivity(activityId: string) {
    return Activity.findOne(
      { id: activityId },
      { relations: ["allocations", "unit"] }
    );
  }

  getActivityForCandidates(activityId: string) {
    return new UnauthorisedAccessedError("TA cannot get activity candidates");
  }

  getActivityForSortedCandidates(activityId: string, sortingCriteria: string) {
    return new UnauthorisedAccessedError("TA cannot get sorted candidates");
  }

  async createActivity(newRecord: Activity, unit: Unit) {
    return new UnauthorisedAccessedError("TA cannot create activities");
  }

  async updateActivity(changedActivity: Activity) {
    return new UnauthorisedAccessedError("TA cannot update activities");
  }

  deleteActivity(activityId: string) {
    return new UnauthorisedAccessedError("TA cannot delete activities");
  }
}

/* Lecturer role authorisation - FULL ACCESS
 * - getAllActivities
 * - getActivity
 * - getActivityForCandidates
 * - getActivityForSortedCandidates
 * - createActivity
 * - updateActivity
 * - deleteActivity
 */

class LecturerActivityController implements IActivityController {
  getAllActivities() {
    return new UnauthorisedAccessedError("Lecturers cannot get all activities");
  }

  getActivity(activityId: string) {
    return Activity.findOne(
      { id: activityId },
      { relations: ["allocations", "unit"] }
    );
  }

  getActivityForCandidates(activityId: string) {
    return Activity.findOneOrFail(
      { id: activityId },
      {
        relations: [
          "allocations",
          "unit",
          "unit.staffPreference",
          "unit.staffPreference.staff",
        ],
      }
    );
  }

  getActivityForSortedCandidates(activityId: string, sortingCriteria: string) {
    return Activity.findOneOrFail(
      { id: activityId },
      {
        relations: [
          "allocations",
          "unit",
          "unit.staffPreference",
          "unit.staffPreference.staff",
          "unit.staffPreference.staff.availability",
          "unit.staffPreference.staff.allocations",
          "unit.staffPreference.staff.allocations.activity",
        ],
      }
    );
  }

  async createActivity(newRecord: Activity, unit: Unit) {
    newRecord.unit = unit;
    let activityToUpdate = await Activity.findOne({
      activityCode: newRecord.activityCode,
      unit: newRecord.unit,
    });

    if (activityToUpdate) {
      await Activity.update({ id: activityToUpdate.id }, newRecord);
      newRecord.id = activityToUpdate.id;
      return newRecord;
    }
    return Activity.save(Activity.create(newRecord));
  }

  async updateActivity(changedActivity: Activity) {
    let activityToUpdate = await Activity.findOneOrFail(changedActivity.id);
    activityToUpdate = changedActivity;
    return Activity.save(activityToUpdate);
  }

  deleteActivity(activityId: string) {
    return Activity.delete({ id: activityId });
  }
}

/* Admin/workforce role authorisation - FULL ACCESS
 * - getAllActivities
 * - getActivity
 * - getActivityForCandidates
 * - getActivityForSortedCandidates
 * - createActivity
 * - updateActivity
 * - deleteActivity
 */
class AdminActivityController implements IActivityController {
  getAllActivities() {
    return Activity.find({
      relations: ["allocations", "unit"], // TODO: think about which relations should be fetch to avoid performance issue
    });
  }

  getActivity(activityId: string) {
    return Activity.findOne(
      { id: activityId },
      { relations: ["allocations", "unit"] }
    );
  }

  getActivityForCandidates(activityId: string) {
    return Activity.findOneOrFail(
      { id: activityId },
      {
        relations: [
          "allocations",
          "unit",
          "unit.staffPreference",
          "unit.staffPreference.staff",
        ],
      }
    );
  }

  getActivityForSortedCandidates(activityId: string, sortingCriteria: string) {
    return Activity.findOneOrFail(
      { id: activityId },
      {
        relations: [
          "allocations",
          "unit",
          "unit.staffPreference",
          "unit.staffPreference.staff",
          "unit.staffPreference.staff.availability",
          "unit.staffPreference.staff.allocations",
          "unit.staffPreference.staff.allocations.activity",
        ],
      }
    );
  }

  async createActivity(newRecord: Activity, unit: Unit) {
    newRecord.unit = unit;
    let activityToUpdate = await Activity.findOne({
      activityCode: newRecord.activityCode,
      unit: newRecord.unit,
    });

    if (activityToUpdate) {
      await Activity.update({ id: activityToUpdate.id }, newRecord);
      newRecord.id = activityToUpdate.id;
      return newRecord;
    }
    return Activity.save(Activity.create(newRecord));
  }

  async updateActivity(changedActivity: Activity) {
    let activityToUpdate = await Activity.findOneOrFail(changedActivity.id);
    activityToUpdate = changedActivity;
    return Activity.save(activityToUpdate);
  }

  deleteActivity(activityId: string) {
    return Activity.delete({ id: activityId });
  }
}
