import { DeleteResult, getRepository } from "typeorm";
import { DELETE, GET, PATCH, Path, PathParam, POST } from "typescript-rest";
import { StaffPreference } from "../entity/StaffPreference";

@Path("/staffpreferences")
class StaffPreferencesService {
  repo = getRepository(StaffPreference);

  /**
   * Returns a list of staffPreferences
   * @return Array<StaffPreference> staffPreferences list
   */
  @GET
  public getAllStaffPreferences(): Promise<Array<StaffPreference>> {
    return this.repo.find();
  }

  /**
   * Returns a staffPreference
   * @param id id for the staffPreference
   * @return StaffPreference single staffPreference
   */
  // TODO: assert return value as Promise<StaffPreference> here
  @GET
  @Path(":id")
  public getStaffPreference(@PathParam("id") id: number) {
    return this.repo.findOne({
      id: id,
    });
  }

  /**
   * Creates a staffPreference
   * @param newRecord staffPreference data
   * @return StaffPreference new staffPreference
   */
  @POST
  public createStaffPreference(
    newRecord: StaffPreference
  ): Promise<StaffPreference> {
    return this.repo.save(this.repo.create(newRecord));
  }

  /**
   * Updates a staffPreference
   * @param changedStaffPreference new staffPreference object to change existing staffPreference to
   * @return StaffPreference changed staffPreference
   */
  @PATCH
  public async updateStaffPreference(
    changedStaffPreference: StaffPreference
  ): Promise<StaffPreference> {
    let staffPreferenceToUpdate = await this.repo.findOne({
      id: changedStaffPreference.id,
    });
    staffPreferenceToUpdate = changedStaffPreference;
    return this.repo.save(staffPreferenceToUpdate);
  }

  /**
   * Deletes an staffPreference
   * @param id id for the staffPreference
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":id")
  public deleteStaffPreference(
    @PathParam("id") id: number
  ): Promise<DeleteResult> {
    return this.repo.delete({
      id: id,
    });
  }
}
