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
import { AvailabilityControllerFactory } from "~/controller";
import { Staff } from "~/entity";
import { hasAdminAccess } from "~/helpers/controlAccess";
import { Availability } from "../entity/Availability";

@Path("/availabilities")
class AvailabilitiesService {
  repo = getRepository(Availability);
  factory = new AvailabilityControllerFactory();

  /**
   * Returns a list of availabilities
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: can get all availabilities for all staff
   *
   * @return Array<Availability> availabilities list
   */
  @GET
  @IgnoreNextMiddlewares
  public async getAllAvailabilities(
    @QueryParam("staffId") staffId: string,
    @ContextRequest req: Request,
    @ContextResponse res: Response
  ): Promise<Array<Availability>> {
    //TODO: move this to controller
    hasAdminAccess(req, res);
    let params: { [key: string]: any } = {
      staffId,
    };
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );
    return Availability.find(params);

    // const me = req.user as Staff;
    // const controller = this.factory.getController(await me.getRoleTitle());
    // return await controller.getAllAvailabilities();
  }

  /**
   * Returns a list of availabilities lists, of staff in order of Monday to Friday
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: can get all availabilities for all staff
   *
   * @return Array<Availability> availabilities list
   */
  @GET
  @IgnoreNextMiddlewares
  @Path("monToFriAvai/:year")
  public async getYearAvailabilities(
    @QueryParam("staffId") staffId: string,
    @PathParam("year") year: string,
    @ContextRequest req: Request,
    @ContextResponse res: Response
  ): Promise<Array<Array<Availability>>> {
    const me = req.user as Staff;
    // None as getRoleTitle should trigger an admin here, else no access should be granted
    const role = await me.getRoleTitle("none");
    const controller = this.factory.getController(role);
    return controller.getMonToFridayAvailabilityByYear(me, year, staffId);
  }

  /**
   * Returns an availability
   *
   * Role authorisation:
   *  - TA: can get availability only for themselves
   *  - Lecturer: can get availability only for themselves
   *  - Admin: can get any availability for any staff
   *
   * @param id id for the availability
   * @return Availability single availability
   */
  // TODO: assert return value as Promise<Availability> here
  @GET
  @Path(":id")
  public async getAvailability(
    @PathParam("id") id: string,
    @ContextRequest req: Request
  ) {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return await controller.getAvailability(id, me);
  }

  /**
   * Creates an availability
   *
   * Role authorisation:
   *  - TA: only allowed to create their own availabilities
   *  - Lecturer: only allowed to create their own availabilities
   *  - Admin: can create any availability for any staff
   *
   * @param newRecord availability data
   * @return Availability new availability
   */
  @POST
  public async createAvailability(
    newRecord: Availability,
    @ContextRequest req: Request
  ): Promise<Availability> {
    // TODO: optimisation
    let staff = await getRepository(Staff).findOneOrFail({
      id: newRecord.staffId,
    });

    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return await controller.createAvailability(newRecord, staff, me);
  }

  /**
   * Updates an availability
   *
   * Role authorisation:
   *  - TA: only allowed to update their own availabilities
   *  - Lecturer: only allowed to update their own availabilities
   *  - Admin: can update any availability
   *
   * @param changedAvailability new availability object to change existing availability to
   * @return Availability changed availability
   */
  @PUT
  public async updateAvailability(
    changedAvailability: Availability,
    @ContextRequest req: Request
  ): Promise<Availability> {
    // TODO: optimisation
    if (changedAvailability.staffId) {
      let staff = await getRepository(Staff).findOneOrFail({
        id: changedAvailability.staffId,
      });
      changedAvailability.staff = staff;
    }

    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return await controller.updateAvailability(changedAvailability, me);
  }

  /**
   * Deletes an availability
   *
   * Role authorisation:
   *  - TA: only allowed to delete their own availabilities
   *  - Lecturer: only allowed to delete their own availabilities
   *  - Admin: can delete any availability
   *
   * @param id id for the availability
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":id")
  public async deleteAvailability(
    @PathParam("id") id: string,
    @ContextRequest req: Request
  ): Promise<DeleteResult> {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return await controller.deleteAvailability(id, me);
  }
}
