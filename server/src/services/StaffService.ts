import { DeleteResult, getRepository } from "typeorm";
import {
  DELETE,
  GET,
  PATCH,
  Path,
  PathParam,
  POST,
  PUT,
  QueryParam,
} from "typescript-rest";
import { StaffControllerFactory } from "~/controller";
import { Unit } from "~/entity";
import { Role } from "~/entity/Role";
import { LooseObject } from "~/interfaces/interfaces";
import { Staff } from "../entity/Staff";

@Path("/staff")
class StaffService {
  repo = getRepository(Staff);
  factory = new StaffControllerFactory();

  // /**
  //  * Returns a list of staff
  //  * @return Array<Staff> staff list
  //  */
  // @GET
  // public getAllStaff(): Promise<Array<Staff>> {
  //   return this.repo.find();
  // }

  /**
   * Note:
   * - This is currently using Role to check if a Staff member belongs to a Unit
   * This should probably be changed to or used along side with StaffPreference
   * - This currently won't return users with Admin access
   * @param unitCode
   * @param offeringPeriod
   * @param year
   */
  @GET
  public async getStaffByUnit(
    @QueryParam("unitCode") unitCode: string,
    @QueryParam("offeringPeriod") offeringPeriod: string,
    @QueryParam("year") year: number
  ): Promise<any> {
    // TODO: refactor to handle other Role
    let params: { [key: string]: any } = {
      unitCode,
      offeringPeriod,
      year,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    const units = await Unit.find({
      select: ["unitCode", "id"],
      where: params,
    });

    let staffList = [];
    for (const unit of units) {
      const data: (Role & LooseObject)[] = await Role.find({
        where: {
          unitId: unit.id,
        },
        relations: ["staff"],
      });

      for (const e of data) {
        e.unitCode = unit.unitCode;
        e.unitId = unit.id;
      }
      staffList.push(...data);
    }

    const result = staffList?.map((e) => {
      let result: LooseObject = {
        role: e.title,
        roleId: e.id,
        unitCode: e.unitCode,
        unitId: e.unitId,
      };
      for (const [key, value] of Object.entries(e.staff)) {
        if (key === "id") {
          result["staffId"] = value;
        } else {
          result[key] = value;
        }
      }
      return result;
    });
    // console.log(result);
    return result;
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
  public async createStaff(newRecord: Staff): Promise<Staff> {
    let staffToUpdate = await Staff.findOne({
      email: newRecord.email,
    });
    if (staffToUpdate) {
      Staff.update({ id: staffToUpdate.id }, newRecord);
      newRecord.id = staffToUpdate.id;
      return newRecord;
    }

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
