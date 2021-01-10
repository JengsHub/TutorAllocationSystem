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
  Errors,
  QueryParam,
} from "typescript-rest";
import { Activity, Staff, Allocation } from "~/entity";
import { checkAllocation } from "../helpers/checkConstraints";
import { AllocationControllerFactory } from "~/controller";
import { authCheck } from "~/helpers/auth";
import { ApprovalEnum } from "~/enums/ApprovalEnum";
import { emailHelperInstance } from "..";
import { Query } from "typeorm/driver/Query";

class ConstraintError extends Errors.HttpError {
  static statusCode: number = 512;
  constructor(message: string) {
    super("ConstraintError", message);
  }
}

@Path("/allocations")
class AllocationsService {
  repo = getRepository(Allocation);
  factory = new AllocationControllerFactory();

  /**
   * Returns a list of allocations
   * @return Array<Allocation> allocations list
   */
  @GET
  public getAllAllocations(): Promise<Array<Allocation>> {
    return this.repo.find();
  }

  /**
   * Get the allocated activities of the current user
   * Option to filter by unit id
   * @param req
   * @param res
   * @param unitId : Optional param to filter allocations by
   */
  @GET
  @IgnoreNextMiddlewares
  @Path("/mine")
  public async getMyAllocation(
    @ContextRequest req: Request,
    @ContextResponse res: Response,
    @QueryParam("unitId") unitId: string,
    @QueryParam("isApproved") isApproved: boolean
    // @QueryParam("offeringPeriod") offeringPeriod: string,
    // @QueryParam("year") year: number
  ) {
    if (!authCheck(req, res)) return;

    const me = req.user as Staff;
    const findOptions: { [key: string]: any } = {
      isApproved
    }
    Object.keys(findOptions).forEach(key => findOptions[key] === undefined ? delete findOptions[key] : {});


    let allocations = await this.repo.find({
      where: {
        staffId: me.id,
        ...findOptions
      },
      relations: ["activity"],
    });

    if (unitId) {
      allocations = allocations.filter((a) => a.activity.unitId === unitId);
    }
    console.log(allocations);

    console.log(allocations);
    return allocations;
  }

  /**
   * Returns an allocation
   * @param unitCode unit code for the allocation
   * @param offeringPeriod offering period for the unit in allocation
   * @return Allocation single allocation
   */
  // TODO: assert return value as Promise<Allocation> here
  @GET
  @Path(":id")
  public getAllocation(@PathParam("id") id: string) {
    return this.repo.findOne({ id });
  }

  /**
   * Creates an allocation
   * @param newRecord allocation data
   * @return Allocation new allocation
   */
  @POST
  public async createAllocation(newRecord: Allocation): Promise<Allocation> {
    // TODO: error message because constraints not met

    let staff = await getRepository(Staff).findOneOrFail({
      id: newRecord.staffId,
    });
    let activity = await getRepository(Activity).findOneOrFail({
      id: newRecord.activityId,
    });

    if (!(await checkAllocation(staff, activity))) {
      throw new ConstraintError(
        "Allocation not made because constraints not met"
      );
    }

    // TODO: optimisation

    newRecord.staff = staff;

    newRecord.activity = activity;
    return this.repo.save(this.repo.create(newRecord));
  }

  @PUT
  @Path(":id/approval")
  public async updateApproval(
    @PathParam("id") id: string,
    @QueryParam("value") value: boolean,
    @ContextRequest req: Request
  ) {
    let allocation = await this.repo.findOneOrFail({
      where: { id: id },
      relations: ["staff", "activity", "activity.unit"],
    });

    const user = req.user as Staff;
    const { staff, activity } = allocation;
    const { unit } = activity;
    const role = await user.getRoleTitle(unit.id);
    const controller = this.factory.getController(role);

    // Offer is made to TA when approval status changes to true
    if (value){
      emailHelperInstance.sendOfferToTa({
        recipient: staff.email,
        content: {
          name: staff.givenNames,
          unit: `${unit.unitCode} - ${unit.offeringPeriod} ${unit.year}`,
          activity: activity.activityCode,
        },
      });
    }
    return controller.updateApproval(user, allocation, value);
  }

  @PUT
  @Path(":id/acceptance")
  public async updateAcceptance(
    @PathParam("id") id: string,
    @QueryParam("value") value: boolean,
    @ContextRequest req: Request
  ) {
    let allocation = await this.repo.findOneOrFail({
      where: { id: id },
      relations: ["staff", "activity", "activity.unit"],
    });

    const user = req.user as Staff;
    const { staff, activity } = allocation;
    const { unit } = activity;
    const role = await user.getRoleTitle(unit.id);
    const controller = this.factory.getController(role);

    // TODO: send email noti to lecturer if accepted

    return controller.updateAcceptance(user, allocation, value);
  }

  /**
   * Updates an allocation
   * @param changedAllocation new allocation object to change existing allocation to
   * @return Allocation changed allocation
   */
  @PUT
  public async updateAllocation(
    changedAllocation: Allocation,
    @ContextRequest req: Request
  ): Promise<Allocation> {
    let allocationToUpdate = await this.repo.findOne(
      {
        id: changedAllocation.id,
      },
      { relations: ["staff", "activity", "activity.unit"] }
    );

    if (!allocationToUpdate)
      throw new Errors.NotFoundError("Allocation not found.");

    const user = req.user as Staff;
    const unit = allocationToUpdate.activity.unit;
    const role = await user.getRoleTitle(unit.id);
    const controller = this.factory.getController(role);

    // TODO: optimisation
    if (changedAllocation.staffId) {
      let staff = await getRepository(Staff).findOneOrFail({
        id: changedAllocation.staffId,
      });
      changedAllocation.staff = staff;
    }
    if (changedAllocation.activityId) {
      let activity = await getRepository(Activity).findOneOrFail({
        id: changedAllocation.activityId,
      });
      changedAllocation.activity = activity;
    }

    if (
      !(await checkAllocation(
        changedAllocation.staff || allocationToUpdate.staff,
        changedAllocation.activity || allocationToUpdate.activity
      ))
    ) {
      throw new ConstraintError(
        "Allocation not updated because constraints not met"
      );
    }
    allocationToUpdate = changedAllocation;
    return controller.updateAllocation(user, allocationToUpdate);
  }

  /**
   * Deletes an allocation
   * @param unitCode unit code for the allocation
   * @param offeringPeriod offering period for the unit in allocation
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":id")
  public deleteAllocation(@PathParam("id") id: string): Promise<DeleteResult> {
    return this.repo.delete({
      id: id,
    });
  }
}
