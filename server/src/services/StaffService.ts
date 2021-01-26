import { DeleteResult, getRepository } from "typeorm";
import { Request } from "express";
import {
  ContextRequest,
  DELETE,
  GET,
  IgnoreNextMiddlewares,
  PATCH,
  Path,
  PathParam,
  POST,
  PUT,
  QueryParam,
} from "typescript-rest";
import { StaffControllerFactory } from "~/controller";
import { Unit } from "~/entity";
import { Role } from "~/entity/Role";
import { LooseObject } from "~/interfaces/interfaces";
import { Staff } from "../entity/Staff";

@Path("/staff")
class StaffService {
  repo = getRepository(Staff);
  factory = new StaffControllerFactory();

  /**
   * Returns a list of staff
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: allowed
   *
   * @return Array<Staff> staff list
   */
  @GET
  @Path("/all")
  @IgnoreNextMiddlewares
  public async getAllStaff(
    @ContextRequest req: Request
  ): Promise<Array<Staff>> {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.getAllStaff();
  }

  /**
   * Note:
   * - This is currently using Role to check if a Staff member belongs to a Unit
   * This should probably be changed to or used along side with StaffPreference
   * - This currently won't return users with Admin access
   * @param unitCode
   * @param offeringPeriod
   * @param year
   */
  @GET
  public async getStaffByUnit(
    @QueryParam("unitCode") unitCode: string,
    @QueryParam("offeringPeriod") offeringPeriod: string,
    @QueryParam("year") year: number,
    @ContextRequest req: Request
  ): Promise<any> {
    // TODO: refactor to handle other Role
    let params: { [key: string]: any } = {
      unitCode,
      offeringPeriod,
      year,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    const units = await Unit.find({
      select: ["unitCode", "id"],
      where: params,
    });

    let staffList = [];
    for (const unit of units) {
      const data: (Role & LooseObject)[] = await Role.find({
        where: {
          unitId: unit.id,
        },
        relations: ["staff"],
      });

      for (const e of data) {
        e.unitCode = unit.unitCode;
        e.unitId = unit.id;
      }
      staffList.push(...data);
    }

    const result = staffList?.map((e) => {
      let result: LooseObject = {
        role: e.title,
        roleId: e.id,
        unitCode: e.unitCode,
        unitId: e.unitId,
      };
      for (const [key, value] of Object.entries(e.staff)) {
        if (key === "id") {
          result["staffId"] = value;
        } else {
          result[key] = value;
        }
      }
      return result;
    });
    return result;
  }

  /**
   * Returns a staff member
   *
   * Role authorisation:
   *  - TA: allowed
   *  - Lecturer: allowed
   *  - Admin: allowed
   *
   * @param id id for the staff member
   * @return Staff single staff member
   */
  // TODO: assert return value as Promise<Staff> here
  @GET
  @Path(":id")
  public async getStaff(
    @PathParam("id") id: string,
    @ContextRequest req: Request
  ) {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.getStaff(id);
  }

  /**
   * Creates a staff member
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: allowed
   *
   * @param newRecord staff data
   * @return Staff new staff member
   */
  @POST
  public async createStaff(
    newRecord: Staff,
    @ContextRequest req: Request
  ): Promise<Staff> {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.createStaff(newRecord);
  }

  /**
   * Updates a staff member
   *
   * Role authorisation:
   *  - TA: can only update themselves (as staff members)
   *  - Lecturer: can only update themselves (as staff members)
   *  - Admin: can update any staff member
   *
   * @param changedStaff new staff object to change existing staff to
   * @return Staff changed staff member
   */
  @PUT
  public async updateStaff(
    changedStaff: Staff,
    @ContextRequest req: Request
  ): Promise<Staff> {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.updateStaff(changedStaff, me);
  }

  /**
   * Deletes a staff member
   *
   * Role authorisation:
   *  - TA: can only delete themselves (as staff members)
   *  - Lecturer: can only delete themselves (as staff members)
   *  - Admin: can delete any staff member
   *
   * @param id id for the staff member
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":id")
  public async deleteStaff(
    @PathParam("id") id: string,
    @ContextRequest req: Request
  ): Promise<DeleteResult> {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.deleteStaff(id, me);
  }
}
