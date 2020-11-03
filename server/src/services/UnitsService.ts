import { DeleteResult, getRepository } from "typeorm";
import { DELETE, GET, PATCH, Path, PathParam, POST } from "typescript-rest";
import { Unit } from "../entity/unit";

@Path("/units")
class UnitsService {
  repo = getRepository(Unit);

  /**
   * Returns a list of units
   * @return Array<Unit> units list
   */
  @GET
  public getAllUnits(): Promise<Array<Unit>> {
    return this.repo.find();
  }

  /**
   * Returns a unit
   * @param id id for the unit
   * @return Unit single unit
   */
  // TODO: assert return value as Promise<Unit> here
  @GET
  @Path(":id")
  public getUnit(@PathParam("id") id: number) {
    return this.repo.findOne({
      id: id,
    });
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
  public deleteUnit(@PathParam("id") id: number): Promise<DeleteResult> {
    return this.repo.delete({
      id: id,
    });
  }
}
