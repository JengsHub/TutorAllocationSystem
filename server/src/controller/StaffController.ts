import { Staff } from "~/entity/Staff";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import { UnauthorisedAccessedError } from "~/helpers/shortcuts";

export class StaffControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IStaffController {
    switch (role) {
      case RoleEnum.TA:
        return new TaStaffController();
      case RoleEnum.LECTURER:
        return new LecturerStaffController();
      case AppRoleEnum.ADMIN:
        return new AdminStaffController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IStaffController {
  getAllStaff(): any;
  getStaff(id: string): any;
  createStaff(newRecord: Staff): any;
  updateStaff(changedStaff: Staff, me: Staff): any;
  deleteStaff(id: string, me: Staff): any;
}

/* TA role authorisation - RESTRICTED ACCESS
 * - getStaff
 * - updateStaff (only themselves)
 * - deleteStaff (only themselves)
 */

class TaStaffController implements IStaffController {
  getAllStaff() {
    throw new UnauthorisedAccessedError("TA cannot get all staff");
  }

  getStaff(id: string) {
    return Staff.findOne({ id });
  }

  async createStaff(newRecord: Staff) {
    throw new UnauthorisedAccessedError("TA cannot create staff");
  }

  async updateStaff(changedStaff: Staff, me: Staff) {
    if (me.id == changedStaff.id) {
      let staffToUpdate = await Staff.findOne({
        id: changedStaff.id,
      });
      staffToUpdate = changedStaff;
      return Staff.save(staffToUpdate);
    } else {
      throw new UnauthorisedAccessedError(
        "Can't update staff other than yourself"
      );
    }
  }

  deleteStaff(id: string, me: Staff) {
    if (me.id == id) {
      return Staff.delete({
        id: id,
      });
    } else {
      throw new UnauthorisedAccessedError(
        "Can't delete staff other than yourself"
      );
    }
  }
}

/* Lecturer role authorisation - RESTRICTED ACCESS
 * - getStaff
 * - updateStaff (only themselves)
 * - deleteStaff (only themselves)
 */

class LecturerStaffController implements IStaffController {
  getAllStaff() {
    throw new UnauthorisedAccessedError("Lecturer cannot get all staff");
  }

  getStaff(id: string) {
    return Staff.findOne({ id });
  }

  async createStaff(newRecord: Staff) {
    throw new UnauthorisedAccessedError("Lecturer cannot create staff");
  }

  async updateStaff(changedStaff: Staff, me: Staff) {
    if (me.id == changedStaff.id) {
      let staffToUpdate = await Staff.findOne({
        id: changedStaff.id,
      });
      staffToUpdate = changedStaff;
      return Staff.save(staffToUpdate);
    } else {
      throw new UnauthorisedAccessedError(
        "Can't update staff other than yourself"
      );
    }
  }

  deleteStaff(id: string, me: Staff) {
    if (me.id == id) {
      return Staff.delete({
        id: id,
      });
    } else {
      throw new UnauthorisedAccessedError(
        "Can't delete staff other than yourself"
      );
    }
  }
}

/* Admin/workforce role authorisation - FULL ACCESS
 * - getAllStaff
 * - getStaff
 * - createStaff
 * - updateStaff
 * - deleteStaff
 */

class AdminStaffController implements IStaffController {
  getAllStaff() {
    return Staff.find({
      where: { appRole: "User" },
    });
  }

  getStaff(id: string) {
    return Staff.findOne({ id });
  }

  async createStaff(newRecord: Staff) {
    let staffToUpdate = await Staff.findOne({
      email: newRecord.email,
    });
    if (staffToUpdate) {
      Staff.update({ id: staffToUpdate.id }, newRecord);
      newRecord.id = staffToUpdate.id;
      return newRecord;
    }

    return Staff.save(Staff.create(newRecord));
  }

  async updateStaff(changedStaff: Staff, me: Staff) {
    let staffToUpdate = await Staff.findOne({
      id: changedStaff.id,
    });
    staffToUpdate = changedStaff;
    return Staff.save(staffToUpdate);
  }

  deleteStaff(id: string, me: Staff) {
    return Staff.delete({
      id: id,
    });
  }
}
