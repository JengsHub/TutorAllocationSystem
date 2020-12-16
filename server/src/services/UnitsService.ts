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
import { AppRoleEnum } from "~/enums/RoleEnum";
import { Unit } from "../entity/Unit";

@Path("/units")
class UnitsService {
  repo = getRepository(Unit);
  factory = new UnitControllerFactory();

  @GET
  public getUnits(
    @QueryParam("unitCode") unitCode: string,
    @QueryParam("offeringPeriod") offeringPeriod: string,
    @QueryParam("year") year: number
  ) {
    let params: { [key: string]: any } = {
      unitCode,
      offeringPeriod,
      year,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    return this.repo.find(params);
  }

  /**
   * Returns a unit
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
   * @param newRecord unit data
   * @return Unit new unit
   */
  @POST
  public createUnit(newRecord: Unit): Promise<Unit> {
    return this.repo.save(this.repo.create(newRecord));
  }

  /**
   * Updates a unit
   * @param changedUnit new unit object to change existing unit to
   * @return Unit changed unit
   */
  @PATCH
  public async updateUnit(changedUnit: Unit): Promise<Unit> {
    let unitToUpdate = await this.repo.findOne({
      id: changedUnit.id,
    });
    unitToUpdate = changedUnit;
    return this.repo.save(unitToUpdate);
  }

  /**
   * Deletes a unit
   * @param id id for the unit
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":id")
  public deleteUnit(@PathParam("id") id: string): Promise<DeleteResult> {
    return this.repo.delete({
      id: id,
    });
  }

  @GET
  @Path(":id/activities")
  public async getUnitActivities(
    @ContextRequest req: Request,
    @ContextResponse res: Response,
    @PathParam("id") id: string
  ) {
    const user = req.user as Staff;
    const unit = await Unit.findOneOrFail({ id });

    const role = user.isAdmin() ? AppRoleEnum.ADMIN : (await user.getRoleForUnit(unit)).title;
    const controller = this.factory.getController(role);
    return controller.getActivities(unit, user);
  }
}
