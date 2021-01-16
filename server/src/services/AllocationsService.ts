import { Request, Response } from "express";
import { DeleteResult, getRepository, SelectQueryBuilder } from "typeorm";
import {
  ContextRequest,
  ContextResponse,
  DELETE,
  Errors,
  GET,
  IgnoreNextMiddlewares,
  PATCH,
  Path,
  PathParam,
  POST,
  PUT,
  QueryParam,
} from "typescript-rest";
import { AllocationControllerFactory } from "~/controller";
import { Activity, Allocation, Staff } from "~/entity";
import { StatusLog } from "~/entity/StatusLog";
import { ActionEnums } from "~/enums/ActionEnum";
import { authCheck } from "~/helpers/auth";
import { createAndSaveStatusLog} from "~/helpers/statusLogHelper";
import { emailHelperInstance } from "..";
import { checkAllocation } from "../helpers/checkConstraints";

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

  // /**
  //  * Returns a list of allocations
  //  * @return Array<Allocation> allocations list
  //  */
  // @GET
  // public getAllAllocations(): Promise<Array<Allocation>> {
  //   return this.repo.find();
  // }

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
    
    // let findOptions: { [key: string]: any } = {
    //   isApproved,
    //   activity: {
    //     unitId
    //   }
    // };

    // findOptions = removeEmpty(findOptions);

    // console.log(findOptions);
    // let allocations = await this.repo.find({
    //   where: {
    //     staffId: me.id,
    //     ...findOptions,
    //   },
    //   relations: ["activity"],
    // });

    /**
     * Note: have to use query builder instead of TypeORM find() because find()
     * support for WHERE clause on joined columns is not consistent/doesn't work.
     * Seems like this feature will be added in future version of TypeORM
     * 
     * See: https://github.com/typeorm/typeorm/issues/2707
     */

    const allocations = await Allocation.createQueryBuilder("allocation")
      .leftJoinAndSelect("allocation.activity", "activity")
      .where("activity.unitId = :unitId", { unitId })
      .andWhere("allocation.staffId = :id", { id: me.id })
      .getMany();

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
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: can create allocation for unit they're lecturing
   *  - Admin: can create allocation in any unit
   *
   * @param newRecord allocation data
   * @return Allocation new allocation
   */
  @POST
  public async createAllocation(
    newRecord: Allocation,
    @ContextRequest req: Request
  ): Promise<Allocation> {
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

    const me = req.user as Staff;
    const controller = this.factory.getController(
      await me.getRoleTitle(activity.unitId)
    );

    let allocation = await controller.createAllocation(me, newRecord);
    console.log(allocation);
    createAndSaveStatusLog(allocation["id"], ActionEnums.MAKE_OFFER, newRecord.staffId)

    return allocation;
  }

  /**
   * Update approval status for specified allocation
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: can approve allocation in unit they're lecturing
   *  - Admin: can approve allocation in any unit
   *
   * @param id allocation id
   * @param value approval value
   * @param req request object
   */
  @PATCH
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

    const me = req.user as Staff;
    const { staff, activity } = allocation;
    const { unit } = activity;
    const role = await me.getRoleTitle(unit.id);
    const controller = this.factory.getController(role);

    // Offer is made to TA when approval status changes to true
    if (value) {
      emailHelperInstance.sendOfferToTa({
        recipient: staff.email,
        content: {
          name: staff.givenNames,
          unit: `${unit.unitCode} - ${unit.offeringPeriod} ${unit.year}`,
          activity: activity.activityCode,
        },
      });

      // Log the status approval here
      createAndSaveStatusLog(id, ActionEnums.LECTURER_APPROVE, me.id);
    }
    // If approval status is false, create status log
    else if (!value){ 
      createAndSaveStatusLog(id, ActionEnums.LECTURER_REJECT, me.id);
    }

    return controller.updateApproval(me, allocation, value);
  }

  /**
   * Update acceptance status for specified allocation
   *
   * Role authorisation:
   *  - TA/Lecturer: can accept allocation assigned to them (i.e. allocation.staffId == user.id)
   *  - Admin: can accept allocation in any unit (on behalf of the assignee)
   *
   * @param id allocation id
   * @param value acceptance value
   * @param req request object
   */
  @PATCH
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

    const me = req.user as Staff;
    const { staff, activity } = allocation;
    const { unit } = activity;
    const role = await me.getRoleTitle(unit.id);
    const controller = this.factory.getController(role);

    // TODO: send email noti to lecturer if accepted
    if(value){  // if value is true, which means the TA accept, log the acceptance in status log
      createAndSaveStatusLog(allocation.id, ActionEnums.TA_ACCEPT, me.id);
    }
    else{  // if value is false, which means the TA accept, log the acceptance in status log
      createAndSaveStatusLog(allocation.id, ActionEnums.TA_REJECT, me.id);
    }
    return controller.updateAcceptance(me, allocation, value);
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
    // TODO: Role-based authorisation
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
   *
   * Role authorisation:
   *  - TA: can delete allocation assigned to them and if the allocation is already approved
   *  - Lecturer: can delete allocation in unit they're lecturing and if the allocation is not already accepted
   *  - Admin: can delete allocation in any unit, regardless of the acceptance status
   *
   * @param unitCode unit code for the allocation
   * @param offeringPeriod offering period for the unit in allocation
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":id")
  public async deleteAllocation(
    @PathParam("id") id: string,
    @ContextRequest req: Request
  ): Promise<DeleteResult> {
    const me = req.user as Staff;
    const allocation = await Allocation.findOneOrFail({
      where: { id },
      relations: ["activity", "activity.unit"],
    });
    const role = await me.getRoleTitle(allocation.activity.unitId);
    const controller = this.factory.getController(role);
    return controller.deleteAllocation(me, allocation);
  }
}

function removeEmpty(obj: any): any {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }),
      {}
    );
}

