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
import { RoleEnum } from "~/enums/RoleEnum";
import { Role } from "~/entity/Role";

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
  public async getUnitActivities(
    @ContextRequest req: Request,
    @ContextResponse res: Response,
    @PathParam("id") id: string
  ) {
    authenticationCheck(req, res);
    const user = req.user as Staff;
    const unit = await Unit.findOneOrFail({ id });
    const role = await user.getRoleForUnit(unit);
    const controller = this.factory.getController(role.title);
    return controller.getActivities(unit, user);
  }
}

class UnitControllerFactory {
  getController(role: RoleEnum): IUnitController {
    switch (role) {
      case RoleEnum.TA:
        return new TaUnitController();
      case RoleEnum.LECTURER:
        return new LecturerUnitController();
      case RoleEnum.ADMIN:
        return new AdminUnitController();
      default:
        throw new Error("Cannot create controller: invalid Role")
    }
  }
}

interface IUnitController {
  getUnits(user: Staff): Promise<Unit[]>;
  getActivities(unit: Unit, user: Staff): Promise<Activity[]>;
}

class TaUnitController implements IUnitController {
  getUnits(user: Staff): Promise<Unit[]> {
    throw new Error("Method not implemented.");
  }
  
  async getActivities(unit: Unit, user: Staff): Promise<Activity[]> {
    let activities = await Activity.find({
      relations: ["allocations"],
      where: {
        unitId: unit.id,
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

    return activities;
  }
}

class LecturerUnitController implements IUnitController {
  getUnits(user: Staff): Promise<Unit[]> {
    throw new Error("Method not implemented.");
  }
  getActivities(unit: Unit, user: Staff): Promise<Activity[]> {
    throw new Error("Method not implemented.");
  }
}

class AdminUnitController implements IUnitController {
  getUnits(user: Staff): Promise<Unit[]> {
    throw new Error("Method not implemented.");
  }
  getActivities(unit: Unit, user: Staff): Promise<Activity[]> {
    throw new Error("Method not implemented.");
  }
}
