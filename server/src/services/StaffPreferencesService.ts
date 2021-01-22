import { Request, Response } from "express";
import { DeleteResult, getRepository, Like } from "typeorm";
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
} from "typescript-rest";
import { StaffPreferenceControllerFactory } from "~/controller";
import { Staff, Unit } from "~/entity";
import { authCheck } from "~/helpers/auth";
import { StaffPreference } from "../entity/StaffPreference";

@Path("/staffpreferences")
class StaffPreferencesService {
  repo = getRepository(StaffPreference);
  factory = new StaffPreferenceControllerFactory();

  /**
   * Returns a list of staffPreferences
   * @return Array<StaffPreference> staffPreferences list
   */
  @GET
  public getAllStaffPreferences(): Promise<Array<StaffPreference>> {
    return this.repo.find({ relations: ["staff", "unit"] });
  }

  /**
   * Return the staff perferences for a current user.
   * @param req
   * @param res
   */
  @GET
  @IgnoreNextMiddlewares
  @Path("/mine")
  public async getMyPreference(
    @ContextRequest req: Request,
    @ContextResponse res: Response
  ) {
    if (!authCheck(req, res)) return;
    const me = req.user as Staff;
    const preferences = await StaffPreference.createQueryBuilder(
      "staffPreference"
    )
      .innerJoinAndSelect("staffPreference.unit", "unit")
      .innerJoin("staffPreference.staff", "staff")
      .where("staff.id = :id", { id: me.id })
      .orderBy("unit.year", "ASC")
      .orderBy("unit.offeringPeriod", "ASC")
      .orderBy("unit.campus", "ASC")
      .orderBy("unit.unitCode", "ASC")
      .getMany();
    // console.log(preferences)
    // const preferences = await this.repo
    //   .find({
    //     where: {
    //       staff: me,
    //     },
    //     relations: ["unit"],
    //   })
    //   .then((result) => {
    //     return result;
    //   });
    return preferences;
  }

  /**
   * Returns a staffPreference
   * @param id id for the staffPreference
   * @return StaffPreference single staffPreference
   */
  // TODO: assert return value as Promise<StaffPreference> here
  @GET
  @Path("/:id")
  public getStaffPreference(@PathParam("id") id: string) {
    return this.repo.findOne({ id }, { relations: ["staff", "unit"] });
  }

  /**
   * Creates a staffPreference
   * @param newRecord staffPreference data
   * @return StaffPreference new staffPreference
   */
  @POST
  public async createStaffPreference(
    newRecord: StaffPreference
  ): Promise<StaffPreference> {
    // TODO: optimisation
    let staff = await getRepository(Staff).findOneOrFail({
      id: newRecord.staffId,
    });
    let unit = await getRepository(Unit).findOneOrFail({
      id: newRecord.unitId,
    });
    let staffPreferenceToUpdate = await StaffPreference.findOne({
      staff: staff,
      unit: unit,
    });
    if (staffPreferenceToUpdate) {
      StaffPreference.update({ id: staffPreferenceToUpdate.id }, newRecord);
      newRecord.staff = staff;
      newRecord.unit = unit;
      return newRecord;
    }

    newRecord.staff = staff;
    newRecord.unit = unit;

    return this.repo.save(this.repo.create(newRecord));
  }

  /**
   * Updates a staffPreference
   * @param changedStaffPreference new staffPreference object to change existing staffPreference to
   * @return StaffPreference changed staffPreference
   */
  @PUT
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
    @PathParam("id") id: string
  ): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}
