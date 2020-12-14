import { DeleteResult, getRepository, createQueryBuilder } from "typeorm";
import {
  DELETE,
  GET,
  PATCH,
  Path,
  PathParam,
  POST,
  PUT,
  Errors,
} from "typescript-rest";
import { Activity, Staff, Rule, Availability } from "~/entity";
import { Allocation } from "../entity/Allocation";
import { DayOfWeek } from "../enums/DayOfWeek";

class ConstraintError extends Errors.HttpError {
  static statusCode: number = 512;
  constructor(message: string) {
    super("ConstraintError", message);
  }
}

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
    // TODO: error message because constraints not met

    if (!(await this.checkAllocation(newRecord))) {
      throw new ConstraintError(
        "Allocation not made because constraints not met"
      );
    }

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
   * Checks if an allocation fits the constraints (global rules as well as individual staff preferences)
   * @param newRecord the new allocation
   * @param staff the staff member taking the allocation
   */
  private async checkAllocation(newRecord: Allocation): Promise<boolean> {
    // TODO: can be optimised. Add a new table/new columns with triggers that automatically count hours for each day when new allocations are made?
    // TODO: consecutive hours. This will be easier if the startTime of activities is stored as a Date.
    // TODO: check for clashes, and compare against available times from the Availibility table

    const staff = await getRepository(Staff).findOneOrFail({
      id: newRecord.staffId,
    });

    const currentAllocations = await this.repo.find({
      relations: ["staff"],
      where: { staff: { id: staff.id } },
    });

    const activitiesRepo = await getRepository(Activity);
    const newActivity = await activitiesRepo.findOne({
      id: newRecord.activityId,
    });
    if (!newActivity) return false;

    let dayHours = newActivity.duration;
    let weekHours = newActivity.duration;
    let activitiesInUnit = 1;
    let totalActivities = 1;

    const activities = await Promise.all(
      currentAllocations.map(
        async (allocation): Promise<Activity | undefined> =>
          allocation.id === newRecord.id
            ? undefined
            : await activitiesRepo.findOne({ id: allocation.activityId })
      )
    );

    activities.forEach((activity) => {
      if (activity && newActivity) {
        // Total hours in day
        if (activity.dayOfWeek === newActivity.dayOfWeek)
          dayHours += activity.duration;
        // Total hours in week
        weekHours += activity.duration;
        // Activities in unit
        if (activity.unitId === newActivity.unitId) activitiesInUnit++;
        // Total activities
        totalActivities++;
      }
    });

    // Checking the numbers against the constraints/rules.
    // TODO: Unfortunately, there's a lot of connascence here with the rule names. Is there a better way to do this?
    const rules = await getRepository(Rule);
    const availability = await getRepository(Availability).findOneOrFail({
      relations: ["staff"],
      where: { staff: { id: staff.id } },
    });

    const maxHoursPerDayRule = (
      await rules.findOneOrFail({ ruleName: "maxHoursPerDay" })
    ).value;
    const maxHoursPerWeekRule = Math.min(
      (await rules.findOneOrFail({ ruleName: "maxHoursPerWeek" })).value,
      availability.maxHours
    );
    const maxActivitiesPerUnitRule = (
      await rules.findOneOrFail({ ruleName: "maxActivitiesPerUnit" })
    ).value;
    const maxTotalActivitiesRule = Math.min(
      (await rules.findOneOrFail({ ruleName: "maxTotalActivities" })).value,
      availability.maxNumberActivities
    );

    //console.log(dayHours, weekHours, activitiesInUnit, totalActivities);

    // Check
    if (
      dayHours > maxHoursPerDayRule ||
      weekHours > maxHoursPerWeekRule ||
      activitiesInUnit > maxActivitiesPerUnitRule ||
      totalActivities > maxTotalActivitiesRule
    )
      return false;
    return true;
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
    // TODO: error message because constraints not met
    if (!(await this.checkAllocation(changedAllocation))) {
      throw new ConstraintError(
        "Allocation not updated because constraints not met"
      );
    }

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
