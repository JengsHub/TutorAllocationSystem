import { DeleteResult, UpdateResult } from "typeorm";
import { Staff, Unit } from "~/entity";
import { Role } from "~/entity/Role";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import { UnauthorisedAccessedError } from "~/helpers/shortcuts";

export class RoleControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IRoleController {
    switch (role) {
      case RoleEnum.TA:
        return new TaRoleController();
      case RoleEnum.LECTURER:
        return new LecturerRoleController();
      case AppRoleEnum.ADMIN:
        return new AdminRoleController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IRoleController {
  getRolesByUnit(user: Staff, unitId: string): any;
  createRole(user: Staff, unitId: string, newRecord: Role): any;
  deleteRole(user: Staff, unitId: string, roleId: string): any;
  updateRole(user: Staff, unitId: string, changedRecord: Role): any;
}

class TaRoleController implements IRoleController {
  deleteRole(user: Staff, unitId: string, roleId: string) {
    return new UnauthorisedAccessedError("TA cannot delete role");
  }
  updateRole(user: Staff, unitId: string, changedRecord: Role) {
    return new UnauthorisedAccessedError("TA cannot update role");
  }
  createRole(user: Staff, unitId: string, newRecord: Role) {
    return new UnauthorisedAccessedError("TA cannot create role");
  }
  getRolesByUnit(user: Staff, unitId: string) {
    return new UnauthorisedAccessedError("TA cannot get roles by unit");
  }
}

class LecturerRoleController implements IRoleController {
  deleteRole(user: Staff, unitId: string, roleId: string) {
    return new UnauthorisedAccessedError("Lecturer cannot delete role");
  }
  updateRole(user: Staff, unitId: string, changedRecord: Role) {
    // TODO: only update Role of the unit if the user is a lecturer of that unit (i.e. need to check if user is Lecturer of that unit)
    return new UnauthorisedAccessedError("Lecturer cannot update role");
  }
  createRole(user: Staff, unitId: string, newRecord: Role) {
    // TODO: only create Role of the unit if the user is a lecturer of that unit (i.e. need to check if user is Lecturer of that unit)
    return new UnauthorisedAccessedError("Lecturer cannot create role");
  }
  getRolesByUnit(user: Staff, unitId: string) {
    // TODO: only get Roles of the unit if the user is a lecturer of that unit
    return new UnauthorisedAccessedError("Lecturer cannot get roles by unit");
  }
}

class AdminRoleController implements IRoleController {
  deleteRole(user: Staff, unitId: string, roleId: string) {
    return Role.delete({ id: roleId });
  }
  async updateRole(user: Staff, unitId: string, changedRecord: Role) {
    console.log(changedRecord);
    let roleToUpdate = await Role.findOneOrFail({
      staffId: changedRecord.staffId,
      unitId: unitId,
    });
    console.log(roleToUpdate);
    return Role.update({ id: roleToUpdate.id }, changedRecord);
  }
  createRole(user: Staff, unitId: string, newRecord: Role) {
    return Role.save(Role.create(newRecord));
  }
  getRolesByUnit(user: Staff, unitId: string) {
    return Role.find({ unitId });
  }
}
