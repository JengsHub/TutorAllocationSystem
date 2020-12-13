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
import { Activity, Allocation, Staff } from "~/entity";
import { authenticationCheck } from "~/helpers/auth";
import { Unit } from "../entity/Unit";
import { Request, Response } from "express";

@Path("/units")
class UnitsService {
  repo = getRepository(Unit);

  @GET
  public getUnits(
    @QueryParam("unitCode") unitCode: string,
    @QueryParam("offeringPeriod") offeringPeriod: string,
    @QueryParam("year") year: number
  ) {
    let params = {
      unitCode,
      offeringPeriod,
      year,
    };

    let searchOptions = {};
    // TODO: better way to do this
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        // @ts-ignore
        searchOptions[key] = value;
      }
    }
    return this.repo.find(searchOptions);
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
  public async getUnitAllocations(
    @ContextRequest req: Request,
    @ContextResponse res: Response,
    @PathParam("id") id: string
  ) {
    authenticationCheck(req, res);
    const user = req.user as Staff;

    let activities = await Activity.find({
      relations: ["allocations"],
      where: {
        unitId: id,
      },
    });

    // Filter out activities that do not have the staff allocated to them
    activities = activities.filter((activity) => {
      const allocations = activity.allocations.filter(
        (allocation) => allocation.staffId == user.id
      );
      activity.allocations = allocations;
      return allocations.length > 0;
    });

    // console.log(activities)
    return activities;
  }
}
