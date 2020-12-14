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
import { StaffControllerFactory } from "~/controller";
import { Staff } from "../entity/Staff";

@Path("/staff")
class StaffService {
  repo = getRepository(Staff);
  factory = new StaffControllerFactory();

  /**
   * Returns a list of staff
   * @return Array<Staff> staff list
   */
  @GET
  public getAllStaff(): Promise<Array<Staff>> {
    return this.repo.find();
  }

  /**
   * Returns a staff member
   * @param id id for the staff member
   * @return Staff single staff member
   */
  // TODO: assert return value as Promise<Staff> here
  @GET
  @Path(":id")
  public getStaff(@PathParam("id") id: string) {
    return this.repo.findOne({
      id,
    });
  }

  /**
   * Creates a staff member
   * @param newRecord staff data
   * @return Staff new staff member
   */
  @POST
  public createStaff(newRecord: Staff): Promise<Staff> {
    return this.repo.save(this.repo.create(newRecord));
  }

  /**
   * Updates a staff member
   * @param changedStaff new staff object to change existing staff to
   * @return Staff changed staff member
   */
  @PUT
  public async updateStaff(changedStaff: Staff): Promise<Staff> {
    let staffToUpdate = await this.repo.findOne({
      id: changedStaff.id,
    });
    staffToUpdate = changedStaff;
    return this.repo.save(staffToUpdate);
  }

  /**
   * Deletes a staff member
   * @param id id for the staff member
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":id")
  public deleteStaff(@PathParam("id") id: string): Promise<DeleteResult> {
    return this.repo.delete({
      id: id,
    });
  }
}
