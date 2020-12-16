import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";

export class StaffPreferenceControllerFactory {
  getController(role: RoleEnum|AppRoleEnum): IStaffPreferenceController {
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

export interface IStaffPreferenceController {}

class TaStaffPreferenceController implements IStaffPreferenceController {}

class LecturerStaffPreferenceController implements IStaffPreferenceController {}

class AdminStaffPreferenceController implements IStaffPreferenceController {}
