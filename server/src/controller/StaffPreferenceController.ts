import { Staff, Unit } from "~/entity";
import { StaffPreference } from "~/entity/StaffPreference";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import { UnauthorisedAccessedError } from "~/helpers/shortcuts";

export class StaffPreferenceControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IStaffPreferenceController {
    switch (role) {
      case RoleEnum.TA:
        return new TaStaffPreferenceController();
      case RoleEnum.LECTURER:
        return new LecturerStaffPreferenceController();
      case AppRoleEnum.ADMIN:
        return new AdminStaffPreferenceController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IStaffPreferenceController {
  getAllStaffPreferences(): any;
  getStaffPreference(id: string): any;
  createStaffPreference(
    newRecord: StaffPreference,
    staff: Staff,
    unit: Unit,
    me: Staff
  ): any;
  updateStaffPreference(
    changedStaffPreference: StaffPreference,
    me: Staff
  ): any;
  deleteStaffPreference(id: string, me: Staff): any;
}

/* TA role authorisation - RESTRICTED ACCESS
 * - getStaffPreference
 * - createStaffPreference (only for themselves)
 * - updateStaffPreference (only for themselves)
 * - deleteStaffPreference (only for themselves)
 */

class TaStaffPreferenceController implements IStaffPreferenceController {
  getAllStaffPreferences() {
    throw new UnauthorisedAccessedError("TA cannot get all staff preferences");
  }

  getStaffPreference(id: string) {
    return StaffPreference.findOne({ id }, { relations: ["staff", "unit"] });
  }

  async createStaffPreference(
    newRecord: StaffPreference,
    staff: Staff,
    unit: Unit,
    me: Staff
  ) {
    if (me == staff) {
      let staffPreferenceToUpdate = await StaffPreference.findOne({
        staff: staff,
        unit: unit,
      });

      if (staffPreferenceToUpdate) {
        StaffPreference.update({ id: staffPreferenceToUpdate.id }, newRecord);
        newRecord.staff = staff;
        newRecord.unit = unit;
        return newRecord;
      }

      newRecord.staff = staff;
      newRecord.unit = unit;

      return StaffPreference.save(StaffPreference.create(newRecord));
    } else {
      throw new UnauthorisedAccessedError(
        "Can't create preference for staff other than yourself"
      );
    }
  }

  async updateStaffPreference(
    changedStaffPreference: StaffPreference,
    me: Staff
  ) {
    if (me == changedStaffPreference.staff) {
      let staffPreferenceToUpdate = await StaffPreference.findOne({
        id: changedStaffPreference.id,
      });
      staffPreferenceToUpdate = changedStaffPreference;
      return StaffPreference.save(staffPreferenceToUpdate);
    } else {
      throw new UnauthorisedAccessedError(
        "Can't update preference for staff other than yourself"
      );
    }
  }

  async deleteStaffPreference(id: string, me: Staff) {
    let preference = await StaffPreference.findOneOrFail({
      id: id,
    });
    if (me == preference.staff) {
      return StaffPreference.delete({ id });
    } else {
      throw new UnauthorisedAccessedError(
        "Can't delete preference for staff other than yourself"
      );
    }
  }
}

/* Lecturer role authorisation - RESTRICTED ACCESS
 * - getStaffPreference
 * - createStaffPreference (only for themselves)
 * - updateStaffPreference (only for themselves)
 * - deleteStaffPreference (only for themselves)
 */
class LecturerStaffPreferenceController implements IStaffPreferenceController {
  getAllStaffPreferences() {
    throw new UnauthorisedAccessedError(
      "Lecturers cannot get all staff preferences"
    );
  }

  getStaffPreference(id: string) {
    return StaffPreference.findOne({ id }, { relations: ["staff", "unit"] });
  }

  async createStaffPreference(
    newRecord: StaffPreference,
    staff: Staff,
    unit: Unit,
    me: Staff
  ) {
    if (me == staff) {
      let staffPreferenceToUpdate = await StaffPreference.findOne({
        staff: staff,
        unit: unit,
      });

      if (staffPreferenceToUpdate) {
        StaffPreference.update({ id: staffPreferenceToUpdate.id }, newRecord);
        newRecord.staff = staff;
        newRecord.unit = unit;
        return newRecord;
      }

      newRecord.staff = staff;
      newRecord.unit = unit;

      return StaffPreference.save(StaffPreference.create(newRecord));
    } else {
      throw new UnauthorisedAccessedError(
        "Can't create preference for staff other than yourself"
      );
    }
  }

  async updateStaffPreference(
    changedStaffPreference: StaffPreference,
    me: Staff
  ) {
    if (me == changedStaffPreference.staff) {
      let staffPreferenceToUpdate = await StaffPreference.findOne({
        id: changedStaffPreference.id,
      });
      staffPreferenceToUpdate = changedStaffPreference;
      return StaffPreference.save(staffPreferenceToUpdate);
    } else {
      throw new UnauthorisedAccessedError(
        "Can't update preference for staff other than yourself"
      );
    }
  }

  async deleteStaffPreference(id: string, me: Staff) {
    let preference = await StaffPreference.findOneOrFail({
      id: id,
    });
    if (me == preference.staff) {
      return StaffPreference.delete({ id });
    } else {
      throw new UnauthorisedAccessedError(
        "Can't delete preference for staff other than yourself"
      );
    }
  }
}

/* Admin/workforce role authorisation - FULL ACCESS
 * - getAllStaffPreferences
 * - getStaffPreference
 * - createStaffPreference
 * - updateStaffPreference
 * - deleteStaffPreference
 */
class AdminStaffPreferenceController implements IStaffPreferenceController {
  getAllStaffPreferences() {
    return StaffPreference.find({ relations: ["staff", "unit"] });
  }

  getStaffPreference(id: string) {
    return StaffPreference.findOne({ id }, { relations: ["staff", "unit"] });
  }

  async createStaffPreference(
    newRecord: StaffPreference,
    staff: Staff,
    unit: Unit
  ) {
    let staffPreferenceToUpdate = await StaffPreference.findOne({
      staff: staff,
      unit: unit,
    });
    if (staffPreferenceToUpdate) {
      StaffPreference.update({ id: staffPreferenceToUpdate.id }, newRecord);
      newRecord.staff = staff;
      newRecord.unit = unit;
      return newRecord;
    }

    newRecord.staff = staff;
    newRecord.unit = unit;

    return StaffPreference.save(StaffPreference.create(newRecord));
  }

  async updateStaffPreference(changedStaffPreference: StaffPreference) {
    let staffPreferenceToUpdate = await StaffPreference.findOne({
      id: changedStaffPreference.id,
    });
    staffPreferenceToUpdate = changedStaffPreference;
    return StaffPreference.save(staffPreferenceToUpdate);
  }

  deleteStaffPreference(id: string) {
    return StaffPreference.delete({ id });
  }
}
