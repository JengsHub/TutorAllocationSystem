import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";

export class AllocationControllerFactory {
  getController(role: RoleEnum|AppRoleEnum): IAllocationController {
    switch (role) {
      case RoleEnum.TA:
        return new TaAllocationController();
      case RoleEnum.LECTURER:
        return new LecturerAllocationController();
      case AppRoleEnum.ADMIN:
        return new AdminAllocationController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IAllocationController {}

class TaAllocationController implements IAllocationController {}

class LecturerAllocationController implements IAllocationController {}

class AdminAllocationController implements IAllocationController {}
