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
import { Staff } from "~/entity";
import { Availability } from "../entity/Availability";

@Path("/availabilities")
class AvailabilitiesService {
  repo = getRepository(Availability);

  /**
   * Returns a list of availabilities
   * @return Array<Availability> availabilities list
   */
  @GET
  public getAllAvailabilities(): Promise<Array<Availability>> {
    return this.repo.find();
  }

  /**
   * Returns an availability
   * @param id id for the availability
   * @return Availability single availability
   */
  // TODO: assert return value as Promise<Availability> here
  @GET
  @Path(":id")
  public getAvailability(@PathParam("id") id: string) {
    return this.repo.findOne({
      id: id,
    });
  }

  /**
   * Creates an availability
   * @param newRecord availability data
   * @return Availability new availability
   */
  @POST
  public async createAvailability(
    newRecord: Availability
  ): Promise<Availability> {
    // TODO: optimisation
    let staff = await getRepository(Staff).findOneOrFail({
      id: newRecord.staffId,
    });
    newRecord.staff = staff;
    return this.repo.save(this.repo.create(newRecord));
  }

  /**
   * Updates an availability
   * @param changedAvailability new availability object to change existing availability to
   * @return Availability changed availability
   */
  @PUT
  public async updateAvailability(
    changedAvailability: Availability
  ): Promise<Availability> {
    let availabilityToUpdate = await this.repo.findOne({
      id: changedAvailability.id,
    });
    // TODO: optimisation
    if (changedAvailability.staffId) {
      let staff = await getRepository(Staff).findOneOrFail({
        id: changedAvailability.staffId,
      });
      changedAvailability.staff = staff;
    }
    availabilityToUpdate = changedAvailability;
    return this.repo.save(availabilityToUpdate);
  }

  /**
   * Deletes an availability
   * @param id id for the availability
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":id")
  public deleteAvailability(
    @PathParam("id") id: string
  ): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}
