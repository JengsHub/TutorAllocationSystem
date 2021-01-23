import { Request, Response } from "express";
import { DeleteResult, getRepository, UpdateResult } from "typeorm";
import {
  ContextRequest,
  ContextResponse,
  DELETE,
  GET,
  PATCH,
  Path,
  PathParam,
  POST,
  PUT,
  QueryParam,
} from "typescript-rest";
import { RoleControllerFactory } from "~/controller/RoleController";
import { Staff } from "~/entity";
import { RoleEnum } from "~/enums/RoleEnum";
import { hasAdminAccess } from "~/helpers/controlAccess";
import { Role } from "../entity/Role";

/***
 * Things to consider:
 * - Should we move this /unit (i.e. UnitService) instead since many of the operations
 * required Role checking which needs the unitId?
 *
 * - Error handling and unauthorised access
 * - General API design
 */

@Path("/roles")
class RolesService {
  repo = getRepository(Role);
  factory = new RoleControllerFactory();

  @GET
  public async getRoles(
    @QueryParam("unitId") unitId: string,
    @QueryParam("staffId") staffId: string,
    @QueryParam("title") title: RoleEnum,
    @ContextRequest req: Request,
    @ContextResponse res: Response
  ) {
    // Only admin can have access to roles in all units
    hasAdminAccess(req, res);
    let params: { [key: string]: any } = {
      unitId,
      staffId,
      title,
    };
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );
    return Role.find(params);
  }

  /**
   * Return a role
   * @param id id of the role
   * @returns Role single role
   */
  @GET
  @Path(":id")
  public async getRoleById(
    @PathParam("id") id: string,
    @ContextRequest req: Request
  ) {
    // TODO: check logic and clean up
    const role = await Role.findOneOrFail({ id });
    const user = req.user as Staff;
    if (!user.isAdmin()) {
      const userRole = await user.getRoleTitle(role.unitId);
      if (userRole === RoleEnum.LECTURER) {
        return role;
      } else if (userRole === RoleEnum.TA && user.id === role.id) {
        return role;
      }
    }
    return role;
  }

  /**
   * Gets a unit's roles
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: allowed for units they are lecturing in
   *  - Admin: allowed
   *
   * @param unitId id of the unit to get roles for
   * @returns Roles list of roles
   */
  @GET
  @Path("unit/:unitId")
  public async getRolesByUnit(
    @PathParam("unitId") unitId: string,
    @ContextRequest req: Request
  ) {
    const user = req.user as Staff;
    const role = await user.getRoleTitle(unitId);
    const controller = this.factory.getController(role);
    return controller.getRolesByUnit(user, unitId);
  }

  @GET
  @Path("unit/:unitId/me")
  public async getMyRoleByUnit(
    @PathParam("unitId") unitId: string,
    @ContextRequest req: Request
  ) {
    const user = req.user as Staff;
    return Role.findOne({ where: { unitId, userId: user.id } });
  }

  /**
   * Creates a role record for the unit
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: allowed for units they are lecturing in
   *  - Admin: allowed
   *
   * @param newRecord role data
   * @returns Role new role record
   */
  @POST
  @Path("unit/:unitId")
  public async createRole(
    newRecord: Role,
    @PathParam("unitId") unitId: string,
    @ContextRequest req: Request
  ): Promise<Role> {
    const user = req.user as Staff;
    const role = await user.getRoleTitle(unitId);
    const controller = this.factory.getController(role);
    newRecord.unitId = unitId;
    // TODO: validate/sanitise newRecord
    return controller.createRole(user, unitId, newRecord);
  }

  /**
   * Updates a role
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: allowed for units they are lecturing in
   *  - Admin: allowed
   *
   * @param changedRole new role object to change the existing role to
   * @returns Role changed role
   */
  @PUT
  @Path("unit/:unitId")
  public async updateRole(
    changedRecord: Role,
    @PathParam("unitId") unitId: string,
    @ContextRequest req: Request,
    @ContextResponse res: Response
  ): Promise<UpdateResult> {
    const user = req.user as Staff;
    const role = await user.getRoleTitle(unitId);
    const controller = this.factory.getController(role);
    changedRecord.unitId = unitId;
    // TODO: validate/sanitise changedRecord
    return controller.updateRole(user, unitId, changedRecord);
  }

  /**
   * Deletes a role
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: allowed for units they are lecturing in
   *  - Admin: allowed
   *
   * @param id id of the role
   * @returns DeleteReults reult of the delete request
   */
  @DELETE
  @Path("unit/:unitId/:roleId")
  public async deleteRole(
    @PathParam("unitId") unitId: string,
    @PathParam("roleId") roleId: string,
    @ContextRequest req: Request
  ): Promise<DeleteResult> {
    const user = req.user as Staff;
    const role = await user.getRoleTitle(unitId);
    const controller = this.factory.getController(role);
    return controller.deleteRole(user, unitId, roleId);
  }
}
