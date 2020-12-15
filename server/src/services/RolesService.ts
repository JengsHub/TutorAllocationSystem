import { Request, Response } from "express";
import { DeleteResult, getRepository } from "typeorm";
import {
  ContextRequest,
  ContextResponse,
  DELETE,
  GET,
  PATCH,
  Path,
  PathParam,
  POST,
  QueryParam,
} from "typescript-rest";
import { Staff } from "~/entity";
import { RoleEnum } from "~/enums/RoleEnum";
import { Role } from "../entity/Role";

@Path("/roles")
class RolesService {
  repo = getRepository(Role);

  @GET
  public async getRoles(
    @QueryParam("unitCode") unitCode: String,
    @QueryParam("staffId") staffId: String,
    @QueryParam("title") title: RoleEnum,
    @ContextRequest req: Request
  ) {
    const user = req.user as Staff;
    let role = await user.getRoles();

    role = role.filter((r) => r.title === RoleEnum.ADMIN);

    // if (role.length > 0) {
    let params = {
      unitCode,
      staffId,
      title,
    };

    let searchOptions = {};
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        // @ts-ignore
        searchOptions[key] = value;
      }
    }

    return this.repo.find(searchOptions);
    // } else {
    // TODO return an error code and message
    // return [];
    // }
  }

  /**
   * Return a role
   * @param id id of the role
   * @returns Role single role
   */
  @GET
  @Path(":id")
  public getRoleById(@PathParam("id") id: string) {
    return this.repo.findOne({ id });
  }

  /**
   * Creates a role record
   * @param newRecord role data
   * @returns Role new role record
   */
  @POST
  public createRole(newRecord: Role): Promise<Role> {
    return this.repo.save(this.repo.create(newRecord));
  }

  /**
   * Updates a role
   * @param changedRole new role object to change the existing role to
   * @returns Role changed role
   */
  @PATCH
  public async updateRole(
    changedRole: Role,
    @ContextRequest req: Request,
    @ContextResponse res: Response
  ): Promise<Role> {
    const user = req.user as Staff;
    let role = await user.getRoles();

    role = role.filter((r) => r.title === RoleEnum.ADMIN);

    if (role.length > 0) {
      let roleToUpdate = await this.repo.findOne({
        id: changedRole.id,
      });
      roleToUpdate = changedRole;
      return this.repo.save(roleToUpdate);
    } else {
      // TODO return and error code and message instead
      return changedRole;
    }
  }

  /**
   * Deletes a role
   * @param id id of the role
   * @returns DeleteReults reult of the delete request
   */
  @DELETE
  @Path(":id")
  public deleteRole(@PathParam("id") id: string): Promise<DeleteResult> {
    return this.repo.delete({
      id: id,
    });
  }
}
