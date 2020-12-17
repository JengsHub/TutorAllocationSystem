import { DeleteResult, UpdateResult } from "typeorm";
import { Staff, Unit } from "~/entity";
import { Role } from "~/entity/Role";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";

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
  getRolesByUnit(user: Staff, unitId: string): Promise<Role[]>;
  createRole(user: Staff, unitId: string, newRecord: Role): Promise<Role>;
  deleteRole(
    user: Staff,
    unitId: string,
    roleId: string
  ): Promise<DeleteResult>;
  updateRole(
    user: Staff,
    unitId: string,
    changedRecord: Role
  ): Promise<UpdateResult>;
}

class TaRoleController implements IRoleController {
  deleteRole(
    user: Staff,
    unitId: string,
    roleId: string
  ): Promise<DeleteResult> {
    throw new Error("Method not implemented.");
  }
  updateRole(
    user: Staff,
    unitId: string,
    changedRecord: Role
  ): Promise<UpdateResult> {
    throw new Error("Method not implemented.");
  }
  createRole(user: Staff, unitId: string, newRecord: Role): Promise<Role> {
    throw new Error("Method not implemented.");
  }
  getRolesByUnit(user: Staff, unitId: string): Promise<Role[]> {
    throw new Error("Method not implemented.");
  }
}

class LecturerRoleController implements IRoleController {
  deleteRole(
    user: Staff,
    unitId: string,
    roleId: string
  ): Promise<DeleteResult> {
    throw new Error("Method not implemented.");
  }
  updateRole(
    user: Staff,
    unitId: string,
    changedRecord: Role
  ): Promise<UpdateResult> {
    // TODO: only update Role of the unit if the user is a lecturer of that unit (i.e. need to check if user is Lecturer of that unit)
    throw new Error("Method not implemented.");
  }
  createRole(user: Staff, unitId: string, newRecord: Role): Promise<Role> {
    // TODO: only create Role of the unit if the user is a lecturer of that unit (i.e. need to check if user is Lecturer of that unit)
    throw new Error("Method not implemented.");
  }
  getRolesByUnit(user: Staff, unitId: string): Promise<Role[]> {
    // TODO: only get Roles of the unit if the user is a lecturer of that unit
    throw new Error("Method not implemented.");
  }
}

class AdminRoleController implements IRoleController {
  deleteRole(
    user: Staff,
    unitId: string,
    roleId: string
  ): Promise<DeleteResult> {
    return Role.delete({ id: roleId });
  }
  async updateRole(
    user: Staff,
    unitId: string,
    changedRecord: Role
  ): Promise<UpdateResult> {
    console.log(changedRecord);
    let roleToUpdate = await Role.findOneOrFail({
      staffId: changedRecord.staffId,
      unitId: unitId,
    });
    console.log(roleToUpdate);
    return Role.update({ id: roleToUpdate.id }, changedRecord);
  }
  createRole(user: Staff, unitId: string, newRecord: Role): Promise<Role> {
    return Role.save(Role.create(newRecord));
  }
  getRolesByUnit(user: Staff, unitId: string): Promise<Role[]> {
    return Role.find({ unitId });
  }
}
