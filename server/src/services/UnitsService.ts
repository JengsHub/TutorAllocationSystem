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
import { UnitControllerFactory } from "~/controller/index";
import { Staff } from "~/entity";
import { Role } from "~/entity/Role";
import { RoleEnum } from "~/enums/RoleEnum";
import { Unit } from "../entity/Unit";

@Path("/units")
class UnitsService {
  repo = getRepository(Unit);
  factory = new UnitControllerFactory();

  /**
   * @swagger
   *
   * /units:
   *   get:
   *     summary: get all units
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Unit'
   * Returns units matching certain criteria (unit code, in the offering period and year specified)
   *
   * Role authorisation:
   *  - TA: allowed
   *  - Lecturer: allowed
   *  - Admin: allowed
   *
   * @param unitCode unit code for the unit
   * @param offeringPeriod offering period to select from
   * @param year year the unit takes place
   * @return Units list of units
   */
  @GET
  public async getUnits(
    @QueryParam("unitCode") unitCode: string,
    @QueryParam("offeringPeriod") offeringPeriod: string,
    @QueryParam("year") year: number,
    @QueryParam("unassigned") unassigned: boolean
  ) {
    let params: { [key: string]: any } = {
      unitCode,
      offeringPeriod,
      year,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    return Unit.find(params);
  }

  /**
   * Returns the calling user's units depending on the role specified
   * (e.g. if lecturer, return the user's units where they are a lecturer)
   *
   * Role authorisation:
   *  - TA: allowed
   *  - Lecturer: allowed
   *  - Admin: allowed
   *
   * @param title title of role (e.g. Lecturer, TA)
   * @return Units list of units
   */
  @GET
  @Path("/byRole/:title")
  public async getMyUnitsByRole(
    @ContextRequest req: Request,
    @ContextResponse res: Response,
    @PathParam("title") title: RoleEnum
  ) {
    const me = req.user as Staff;
    const roles: Role[] = await getRepository(Role).find({
      where: {
        staff: me,
        title: title,
      },
      relations: ["unit"],
    });
    let units: Unit[] = [];
    for (let r of roles) {
      const unit = await this.repo.findOne(r.unitId, {
        relations: ["activities"],
      });
      if (unit) units.push(unit);
    }

    return units;
  }

  /**
   * Returns a unit
   *
   * Role authorisation:
   *  - TA: allowed
   *  - Lecturer: allowed
   *  - Admin: allowed
   *
   * @param id id for the unit
   * @return Unit single unit
   */
  // TODO: assert return value as Promise<Unit> here
  @GET
  @Path(":id")
  public getUnitById(@PathParam("id") id: string) {
    return this.repo.findOne({ id });
  }

  /**
   * Creates a unit
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: allowed
   *
   * @param newRecord unit data
   * @return Unit new unit
   */
  @POST
  public async createUnit(
    newRecord: Unit,
    @ContextRequest req: Request
  ): Promise<Unit> {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.createUnit(newRecord);
  }

  /**
   * Updates a unit
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: allowed
   *  - Admin: allowed
   *
   * @param changedUnit new unit object to change existing unit to
   * @return Unit changed unit
   */
  @PATCH
  public async updateUnit(
    changedUnit: Unit,
    @ContextRequest req: Request
  ): Promise<Unit> {
    const me = req.user as Staff;
    const controller = this.factory.getController(
      await me.getRoleTitle(changedUnit.id)
    );
    return controller.updateUnit(changedUnit);
  }

  /**
   * Deletes a unit
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: allowed
   *
   * @param id id for the unit
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":id")
  public async deleteUnit(
    @PathParam("id") id: string,
    @ContextRequest req: Request
  ): Promise<DeleteResult> {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle(id));
    return controller.deleteUnit(id);
  }

  /**
   * Get the activities of a unit
   *
   * Role authorisation:
   *  - TA: allowed
   *  - Lecturer: allowed
   *  - Admin: allowed
   *
   * @param id id of the unit
   * @return Activities list of activities
   */
  @GET
  @Path(":id/activities")
  public async getUnitActivities(
    @ContextRequest req: Request,
    @PathParam("id") id: string
  ) {
    const user = req.user as Staff;
    const unit = await Unit.findOneOrFail({ id });
    const role = await user.getRoleTitle(unit.id);

    const controller = this.factory.getController(role);
    return controller.getUnitActivities(unit);
  }
}
