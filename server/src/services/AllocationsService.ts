import { DeleteResult, getRepository } from "typeorm";
import { DELETE, GET, PATCH, Path, PathParam, POST } from "typescript-rest";
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
    return this.repo.findOne({
      id: id,
    });
  }

  /**
   * Creates an allocation
   * @param newRecord allocation data
   * @return Allocation new allocation
   */
  @POST
  public createAllocation(newRecord: Allocation): Promise<Allocation> {
    return this.repo.save(this.repo.create(newRecord));
  }

  /**
   * Updates an allocation
   * @param changedAllocation new allocation object to change existing allocation to
   * @return Allocation changed allocation
   */
  @PATCH
  public async updateAllocation(
    changedAllocation: Allocation
  ): Promise<Allocation> {
    let allocationToUpdate = await this.repo.findOne({
      id: changedAllocation.id,
    });
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
  public deleteAdmin(@PathParam("id") id: string): Promise<DeleteResult> {
    return this.repo.delete({
      id: id,
    });
  }
}
