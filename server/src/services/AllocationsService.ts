import { DeleteResult, getRepository } from "typeorm";
import {
  DELETE,
  GET,
  PATCH,
  Path,
  PathParam,
  POST,
  PUT,
} from "typescript-rest";
import { Activity, Staff, Unit } from "~/entity";
import { Allocation } from "../entity/Allocation";

@Path("/allocations")
class AllocationsService {
  repo = getRepository(Allocation);

  /**
   * Returns a list of allocations
   * @return Array<Allocation> allocations list
   */
  @GET
  public getAllAllocations(): Promise<Array<Allocation>> {
    return this.repo.find();
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
    if (changedAllocation.staffId){
      let staff = await getRepository(Staff).findOneOrFail({ id: changedAllocation.staffId });
      changedAllocation.staff = staff
    }
    if (changedAllocation.activityId){
      let activity = await getRepository(Activity).findOneOrFail({ id: changedAllocation.activityId });
      changedAllocation.activity = activity
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
