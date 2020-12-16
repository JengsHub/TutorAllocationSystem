import { DeleteResult, getRepository } from "typeorm";
import {
  ContextRequest,
  ContextResponse,
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
import { Request, Response } from "express";

import { AllocationControllerFactory } from "~/controller";
import { Activity, Staff, Unit } from "~/entity";
import { Allocation } from "../entity/Allocation";
import { authenticationCheck } from "~/helpers/auth";
import { ApprovalEnum } from "~/enums/ApprovalEnum";
import { app } from "..";

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
    @QueryParam("approval") approval: ApprovalEnum
    // @QueryParam("offeringPeriod") offeringPeriod: string,
    // @QueryParam("year") year: number
  ) {
    authenticationCheck(req, res);

    // Fetch all users allocaitons
    const me = req.user as Staff;
    let allocations = await this.repo.find({
      where: {
        staff: me,
      },
      relations: ["activity"],
    });

    if (unitId) {
      allocations = allocations.filter((a) => a.activity.unitId === unitId);
    }
    console.log(allocations);
    if (approval) {
      allocations = allocations.filter(
        (a) =>
          Object.values(ApprovalEnum).indexOf(a.approval) >=
          Object.values(ApprovalEnum).indexOf(approval)
      );
    }
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
    // TODO: optimisation
    let staff = await getRepository(Staff).findOneOrFail({
      id: newRecord.staffId,
    });
    newRecord.staff = staff;
    let activity = await getRepository(Activity).findOneOrFail({
      id: newRecord.activityId,
    });
    newRecord.activity = activity;
    return this.repo.save(this.repo.create(newRecord));
  }

  @POST
  @Path("approval/:id/:approval")
  public async updateApproval(
    @PathParam("id") id: string,
    @PathParam("approval") approval: ApprovalEnum
  ) {
    console.log(id, approval);
    let allocation = await this.repo.findOne({ where: { id: id } });
    console.log(allocation);
    if (allocation) {
      allocation.approval = approval;
      return await this.repo.update(
        { id: allocation.id },
        { approval: approval }
      );
    }
    console.error("No allocation by this id");
  }

  /**
   * Updates an allocation
   * @param changedAllocation new allocation object to change existing allocation to
   * @return Allocation changed allocation
   */
  @PUT
  public async updateAllocation(
    changedAllocation: Allocation
  ): Promise<Allocation> {
    let allocationToUpdate = await this.repo.findOne({
      id: changedAllocation.id,
    });
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

    allocationToUpdate = changedAllocation;
    return this.repo.save(allocationToUpdate);
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
