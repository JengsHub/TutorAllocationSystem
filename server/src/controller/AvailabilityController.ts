import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";

export class AvailabilityControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IAvailabilityController {
    switch (role) {
      case RoleEnum.TA:
        return new TaAvailabilityController();
      case RoleEnum.LECTURER:
        return new LecturerAvailabilityController();
      case AppRoleEnum.ADMIN:
        return new AdminAvailabilityController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IAvailabilityController {}

class TaAvailabilityController implements IAvailabilityController {}

class LecturerAvailabilityController implements IAvailabilityController {}

class AdminAvailabilityController implements IAvailabilityController {}
