import { Request, Response } from "express";
import { exception } from "console";
import { DeleteResult, getRepository, Not } from "typeorm";
import {
  ContextRequest,
  DELETE,
  GET,
  Path,
  PathParam,
  POST,
  PUT,
  QueryParam,
  Security,
  IgnoreNextMiddlewares,
  ContextResponse,
  PATCH,
} from "typescript-rest";
import { resError } from "~/helpers";
import { ActivityControllerFactory } from "~/controller";
import { Activity } from "../entity/Activity";
import { StaffPreference, Unit, Staff, Role, Allocation } from "~/entity";
import { checkNewAllocation } from "../helpers/checkConstraints";

@Path("/activities")
class ActivitiesService {
  factory = new ActivityControllerFactory();
  repo = getRepository(Activity);

  // TODO:

  /**
   * Returns a list of activities
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: can get all activities always
   *
   * @return Array<Activity> activities list
   */
  @GET
  public async getAllActivities(
    @ContextRequest req: Request
  ): Promise<Array<Activity>> {
    /**
     * Note on relations option in find
     * - Currently the relations are not eager or lazy relations (those can be more convenient but come with their own drawbacks)
     * so we need to specifiy the relations in find* methods
     * - To also load nested relation, i.e relations: ["allocations", "allocations.staff"]
     */
    return this.repo.find({
      relations: ["allocations", "allocations.staff", "unit"], // TODO: think about which relations should be fetch to avoid performance issue
    });
  }

  /**
   * Returns a list of activities
   * @return Array<Activity> activities list
   */
  @GET
  @IgnoreNextMiddlewares
  @Path("/all-my-lecturing")
  public async getAllLecturingActivities(
    @ContextRequest req: Request,
    @ContextResponse res: Response
  ) {
    const user = req.user as Staff;
    let activities = await Activity.createQueryBuilder("activity")
      .leftJoinAndSelect("activity.allocations", "allocations")
      .leftJoinAndSelect("allocations.staff", "staff")
      .innerJoinAndSelect("activity.unit", "unit")
      .innerJoin(Role, "role", "role.unitId = unit.id")
      .where("role.staffId = :id", { id: user.id })
      .andWhere("role.title = :role", { role: "Lecturer" })
      .orderBy("unit.unitCode", "ASC")
      .getMany();

    console.log(activities);
    return activities;
  }
  /**
   * Returns an allocation based on the activity id given
   * @param id acitivity id
   */
  @GET
  @Path(":activityId/allocation")
  public async getAllocations(@PathParam("activityId") id: string) {
    let allocation: Allocation[];
    try {
      allocation = await Allocation.find({ activityId: id });
    } catch (e) {
      return resError(
        "Query to find allocations failed - this is probably because the uuid syntax is wrong"
      );
    }
    return allocation;
  }

  /**
   * Returns an activity
   *
   * Role authorisation:
   *  - TA: can get activities if they have the unit id
   *  - Lecturer: can get activities if they have the unit id
   *  - Admin: can get all activities always
   *
   * @param activityCode activity code
   * @return Activity single activity
   */
  // TODO: assert return value as Promise<Activity> here
  // TODO: changed activityCode to activityId since activityCode is not unique/primary key
  @GET
  @Path(":activityId")
  @IgnoreNextMiddlewares
  public async getActivity(
    @PathParam("activityId") id: string,
    @ContextRequest req: Request
  ) {
    const me = req.user as Staff;
    let activity = await Activity.createQueryBuilder("activity")
      .where("activity.id = :id", { id })
      .getOne();

    const controller = this.factory.getController(
      await me.getRoleTitle(activity?.unitId)
    );
    return controller.getActivity(id);
  }

  /**
   * Returns the unsorted candidate pool for an activity
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: can get candidates in units they are lecturing
   *  - Admin: can get candidates always
   *
   * @param activityCode activity code
   * @return StaffPreference[] list of staff preferences that are potential candidates for an activity
   */
  // TODO: assert return value as Promise<StaffPreference[]> here
  @GET
  @Path(":activityId/candidates")
  public async getCandidates(
    @PathParam("activityId") id: string,
    @ContextRequest req: Request
  ) {
    // Get the activity given by the activityId, else return errors
    // Activity is joined with unit, staffpreferences and staff here
    let activity: Activity;
    try {
      const me = req.user as Staff;
      const controller = this.factory.getController(await me.getRoleTitle());
      activity = await controller.getActivityForCandidates(id);

      if (!activity) {
        return resError("Activity not found");
      }
    } catch (e) {
      return resError(
        "Query to find activity failed - this is probably because the uuid syntax is wrong or you are not authorised"
      );
    }

    let candidates: StaffPreference[] = [];
    let r: any = [];
    // Find all staff with preferences in activity's unit
    const staffPreferences = activity.unit.staffPreference;
    if (staffPreferences) {
      for (let preference of staffPreferences) {
        // If the staff member isn't already allocated to the activity, check to see if they are available to be allocated to the activity
        if (
          activity.allocations.filter(function (e) {
            return e.staffId === preference.staffId;
          }).length == 0
        ) {
          if (await checkNewAllocation(preference.staff, activity)) {
            // If they're available, push them to the candidate pool
            candidates.push(preference);
          }
        }
      }
    }
    console.log(candidates);
    return candidates;
  }

  /**
   * Returns the sorted candidate pool for an activity
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: can get sorted candidates in units they are lecturing
   *  - Admin: can get sorted candidates always
   *
   * @param activityCode activity code
   * @param sortingCriteria the criteria to sort the candidate pool by ("staff" or "lecturer")
   * @return StaffPreference[] sorted list of staff preferences that are potential candidates for an activity
   */
  // TODO: assert return value as Promise<StaffPreference[]> here
  @GET
  @Path(":activityId/candidates/:sortingCriteria")
  public async getSortedCandidates(
    @PathParam("activityId") id: string,
    @PathParam("sortingCriteria") sortingCriteria: string,
    @ContextRequest req: Request
  ) {
    // Get the activity given by the activityId, else return errors
    // Activity is joined with unit, staffpreferences, staff and availability here
    let activity: Activity;
    try {
      const me = req.user as Staff;
      let act = await Activity.createQueryBuilder("activity")
        .where("activity.id = :id", { id })
        .getOne();

      const controller = this.factory.getController(
        await me.getRoleTitle(act?.unitId)
      );
      activity = await controller.getActivityForSortedCandidates(
        id,
        sortingCriteria
      );

      if (!activity) {
        return resError("Activity not found");
      }
    } catch (e) {
      return resError(
        "Query to find activity failed - this is probably because the uuid syntax is wrong or you are not authorised"
      );
    }

    let candidates: StaffPreference[] = [];

    // Find all staff with preferences in activity's unit
    const staffPreferences = activity.unit.staffPreference;
    if (staffPreferences) {
      for (const preference of staffPreferences) {
        // If the staff member isn't already allocated to the activity, check to see if they are available to be allocated to the activity
        console.log(
          activity.allocations.filter(function (e) {
            console.log(e.staffId);
            return e.staffId === preference.staffId;
          })
        );
        if (
          activity.allocations.filter(function (e) {
            return e.staffId === preference.staffId;
          }).length == 0
        ) {
          if (await checkNewAllocation(preference.staff, activity)) {
            // If they're available, push them to the candidate pool
            candidates.push(preference);
          }
        }
      }
    }

    // Sort the candidates using the criteria provided, else return error if sorting criteria is invalid
    try {
      candidates = this.sortCandidates(sortingCriteria, candidates)!;
    } catch (e) {
      return resError("Invalid sorting criteria - unable to sort");
    }

    return candidates;
  }

  /**
   * Sorts a list of candidates based on given sorting criteria
   * @param sortingCriteria "staff" for sorting based on staffScore or "lecturer" for sorting based on lecturer score
   * @param candidates StaffPreference[] list of unsorted candidates
   * @return StaffPreference[] if valid sorting criteria provided, else throws exception
   */
  private sortCandidates(
    sortingCriteria: string,
    candidates: StaffPreference[]
  ) {
    // If there's no candidates, no need to sort
    if (candidates.length == 0) {
      return candidates;
    }

    // Sort by staff score
    if (sortingCriteria == "staff") {
      candidates = candidates.sort((a, b) => {
        if (a.preferenceScore > b.preferenceScore) {
          return 1;
        }
        if (a.preferenceScore < b.preferenceScore) {
          return -1;
        }
        return 0;
      });

      // Sort by lecturer score
    } else if (sortingCriteria == "lecturer") {
      candidates = candidates.sort((a, b) => {
        if (a.lecturerScore > b.lecturerScore) {
          return 1;
        }
        if (a.lecturerScore < b.lecturerScore) {
          return -1;
        }
        return 0;
      });
      // If no valid sorting criteria provided, throw exception
    } else {
      throw exception("Invalid sorting criteria parameter");
    }

    return candidates;
  }

  /**
   * Updates the max number of allocation for a particular activity
   * @param id : id of the activity
   * @param newMaxNumberOfAllocation  : the new max number of allocation
   */
  @PATCH
  @Path(":id/allocationsMaxNum")
  public async updateMaxNumberOfAllocations(
    @PathParam("id") id: string,
    @QueryParam("value") newMaxNumberOfAllocation: number,
    @ContextRequest req: Request
  ) {
    let activity: any = await Activity.findOneOrFail(id);
    activity.allocationsMaxNum = newMaxNumberOfAllocation;
    return activity.save(activity);
  }

  /**
   * Creates an activity
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: can create activities in units they are lecturing
   *  - Admin: can create activity
   *
   * @param newRecord activity data
   * @return Activity new activity
   */
  @POST
  public async createActivity(
    newRecord: Activity,
    @ContextRequest req: Request
  ): Promise<Activity> {
    // TODO: better optimisation since it's wasteful to fetch unit when we don't use it
    // potential solution: https://github.com/typeorm/typeorm/issues/447
    let unit = await getRepository(Unit).findOneOrFail({
      id: newRecord.unitId,
    });

    const me = req.user as Staff;
    const controller = this.factory.getController(
      await me.getRoleTitle(newRecord.unitId)
    );
    return await controller.createActivity(newRecord, unit);
  }

  /**
   * Updates an activity
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: allowed to update activities where they are lecturer
   *  - Admin: can update any activity
   * @param changedActivity new activity object to change existing activity to
   * @return Activity changed activity
   */
  @PUT
  public async updateActivity(
    changedActivity: Activity,
    @ContextRequest req: Request
  ): Promise<Activity> {
    // TODO: optimisation
    if (changedActivity.unitId) {
      let unit = await getRepository(Unit).findOneOrFail({
        id: changedActivity.unitId,
      });
      changedActivity.unit = unit;
    }

    const me = req.user as Staff;
    const controller = this.factory.getController(
      await me.getRoleTitle(changedActivity.unitId)
    );
    return controller.updateActivity(changedActivity);
  }

  /**
   * Deletes an activity
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: can delete activities in units they are lecturing
   *  - Admin: can delete any activity
   *
   * @param activityCode activity code
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":activityId")
  public async deleteActivity(
    @PathParam("activityId") id: string,
    @ContextRequest req: Request
  ): Promise<DeleteResult> {
    let activity = await Activity.findOneOrFail(id);

    const me = req.user as Staff;
    const controller = this.factory.getController(
      await me.getRoleTitle(activity.unitId)
    );
    return controller.deleteActivity(id);
  }
}
