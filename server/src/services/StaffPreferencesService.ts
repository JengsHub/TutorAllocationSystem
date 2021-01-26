import { Request, Response } from "express";
import { DeleteResult, getRepository } from "typeorm";
import {
  ContextRequest,
  ContextResponse,
  DELETE,
  GET,
  IgnoreNextMiddlewares,
  Path,
  PathParam,
  POST,
  PUT,
  QueryParam,
} from "typescript-rest";
import { StaffPreferenceControllerFactory } from "~/controller";
import { Staff, Unit } from "~/entity";
import { authCheck } from "~/helpers/auth";
import { hasAdminAccess } from "~/helpers/controlAccess";
import { StaffPreference } from "../entity/StaffPreference";

@Path("/staffpreferences")
class StaffPreferencesService {
  repo = getRepository(StaffPreference);
  factory = new StaffPreferenceControllerFactory();

  /**
   * Returns a list of staffPreferences
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: allowed
   *
   * @return Array<StaffPreference> staffPreferences list
   */
  @GET
  public async getAllStaffPreferences(
    @QueryParam("staffId") staffId: string,
    @ContextRequest req: Request,
    @ContextResponse res: Response
  ): Promise<Array<StaffPreference>> {
    //TODO: move this to controller
    hasAdminAccess(req, res);
    let params: { [key: string]: any } = {
      staffId,
    };
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );
    return StaffPreference.find({
      where: params,
      relations: ["unit"],
    });

    // const me = req.user as Staff;
    // const controller = this.factory.getController(await me.getRoleTitle());
    // return controller.getAllStaffPreferences();
  }

  /**
   * Return the staff perferences for a current user.
   * @param req
   * @param res
   */
  @GET
  @IgnoreNextMiddlewares
  @Path("/mine")
  public async getMyPreference(
    @ContextRequest req: Request,
    @ContextResponse res: Response
  ) {
    if (!authCheck(req, res)) return;
    const me = req.user as Staff;
    const preferences = await StaffPreference.createQueryBuilder(
      "staffPreference"
    )
      .innerJoinAndSelect("staffPreference.unit", "unit")
      .innerJoin("staffPreference.staff", "staff")
      .where("staff.id = :id", { id: me.id })
      .orderBy("unit.year", "ASC")
      .orderBy("unit.offeringPeriod", "ASC")
      .orderBy("unit.campus", "ASC")
      .orderBy("unit.unitCode", "ASC")
      .getMany();
    // const preferences = await this.repo
    //   .find({
    //     where: {
    //       staff: me,
    //     },
    //     relations: ["unit"],
    //   })
    //   .then((result) => {
    //     return result;
    //   });
    return preferences;
  }

  /**
   * Returns a staffPreference
   *
   * Role authorisation:
   *  - TA: allowed
   *  - Lecturer: allowed
   *  - Admin: allowed
   *
   * @param id id for the staffPreference
   * @return StaffPreference single staffPreference
   */
  // TODO: assert return value as Promise<StaffPreference> here
  @GET
  @Path("/:id")
  public async getStaffPreference(
    @PathParam("id") id: string,
    @ContextRequest req: Request
  ) {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.getStaffPreference(id);
  }

  /**
   * Creates a staffPreference
   *
   * Role authorisation:
   *  - TA: can only create preferences for themselves
   *  - Lecturer: can only create preferences for themselves
   *  - Admin: can create any staff preference
   *
   * @param newRecord staffPreference data
   * @return StaffPreference new staffPreference
   */
  @POST
  public async createStaffPreference(
    newRecord: StaffPreference,
    @ContextRequest req: Request
  ): Promise<StaffPreference> {
    // TODO: optimisation
    let staff = await getRepository(Staff).findOneOrFail({
      id: newRecord.staffId,
    });
    let unit = await getRepository(Unit).findOneOrFail({
      id: newRecord.unitId,
    });
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.createStaffPreference(newRecord, staff, unit, me);
  }

  /**
   * Updates a staffPreference
   *
   * Role authorisation:
   *  - TA: can only update preferences for themselves
   *  - Lecturer: can only update preferences for themselves
   *  - Admin: can update any staff preference
   *
   * @param changedStaffPreference new staffPreference object to change existing staffPreference to
   * @return StaffPreference changed staffPreference
   */
  @PUT
  public async updateStaffPreference(
    changedStaffPreference: StaffPreference,
    @ContextRequest req: Request
  ): Promise<StaffPreference> {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.updateStaffPreference(changedStaffPreference, me);
  }

  /**
   * Deletes an staffPreference
   *
   * Role authorisation:
   *  - TA: can only delete preferences for themselves
   *  - Lecturer: can only delete preferences for themselves
   *  - Admin: can delete any staff preference
   *
   * @param id id for the staffPreference
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":id")
  public async deleteStaffPreference(
    @PathParam("id") id: string,
    @ContextRequest req: Request
  ): Promise<DeleteResult> {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.deleteStaffPreference(id, me);
  }
}
