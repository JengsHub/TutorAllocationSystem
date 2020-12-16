import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";

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

export interface IActivityController {}

class TaActivityController implements IActivityController {}

class LecturerActivityController implements IActivityController {}

class AdminActivityController implements IActivityController {}
