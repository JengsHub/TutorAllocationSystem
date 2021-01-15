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

class TaStaffController implements IStaffController {
  getAllStaff() {
    return new UnauthorisedAccessedError("TA cannot get all staff");
  }

  getStaff(id: string) {
    return Staff.findOne({ id });
  }

  async createStaff(newRecord: Staff) {
    return new UnauthorisedAccessedError("TA cannot create staff");
  }

  async updateStaff(changedStaff: Staff, me: Staff) {
    if (me.id == changedStaff.id) {
      let staffToUpdate = await Staff.findOne({
        id: changedStaff.id,
      });
      staffToUpdate = changedStaff;
      return Staff.save(staffToUpdate);
    } else {
      return new UnauthorisedAccessedError(
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
      return new UnauthorisedAccessedError(
        "Can't delete staff other than yourself"
      );
    }
  }
}

class LecturerStaffController implements IStaffController {
  getAllStaff() {
    return new UnauthorisedAccessedError("Lecturer cannot get all staff");
  }

  getStaff(id: string) {
    return Staff.findOne({ id });
  }

  async createStaff(newRecord: Staff) {
    return new UnauthorisedAccessedError("Lecturer cannot create staff");
  }

  async updateStaff(changedStaff: Staff, me: Staff) {
    if (me.id == changedStaff.id) {
      let staffToUpdate = await Staff.findOne({
        id: changedStaff.id,
      });
      staffToUpdate = changedStaff;
      return Staff.save(staffToUpdate);
    } else {
      return new UnauthorisedAccessedError(
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
      return new UnauthorisedAccessedError(
        "Can't delete staff other than yourself"
      );
    }
  }
}

class AdminStaffController implements IStaffController {
  getAllStaff() {
    return Staff.find();
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
