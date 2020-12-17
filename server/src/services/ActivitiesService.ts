import { exception } from "console";
import { DeleteResult, getRepository } from "typeorm";
import {
  DELETE,
  GET,
  Path,
  PathParam,
  POST,
  PUT,
  QueryParam,
  Security,
} from "typescript-rest";
import { StaffPreference, Unit } from "~/entity";
import { resError } from "~/helpers";
import { ActivityControllerFactory } from "~/controller";
import { Activity } from "../entity/Activity";
import { checkAllocation } from "../helpers/checkConstraints";

@Path("/activities")
class ActivitiesService {
  factory = new ActivityControllerFactory();
  repo = getRepository(Activity);

  /**
   * Returns a list of activities
   * @return Array<Activity> activities list
   */
  @GET
  public getAllActivities(): Promise<Array<Activity>> {
    /**
     * Note on relations option in find
     * - Currently the relations are not eager or lazy relations (those can be more convenient but come with their own drawbacks)
     * so we need to specifiy the relations in find* methods
     * - To also load nested relation, i.e relations: ["allocations", "allocations.staff"]
     */
    return this.repo.find({
      relations: ["allocations", "unit"], // TODO: think about which relations should be fetch to avoid performance issue
    });
  }

  /**
   * Returns an activity
   * @param activityCode activity code
   * @return Activity single activity
   */
  // TODO: assert return value as Promise<Activity> here
  // TODO: changed activityCode to activityId since activityCode is not unique/primary key
  @GET
  @Path(":activityId")
  public async getActivity(@PathParam("activityId") id: string) {
    let activity = await this.repo.findOne(
      { id },
      { relations: ["allocations", "unit"] }
    );
    return activity;
  }

  /**
   * Returns the unsorted candidate pool for an activity
   * @param activityCode activity code
   * @return StaffPreference[] list of staff preferences that are potential candidates for an activity
   */
  // TODO: assert return value as Promise<StaffPreference[]> here
  @GET
  @Path(":activityId/candidates")
  public async getCandidates(@PathParam("activityId") id: string) {
    // Get the activity given by the activityId, else return errors
    // Activity is joined with unit, staffpreferences and staff here
    try {
      var activity = await this.repo.findOne(
        { id },
        {
          relations: [
            "allocations",
            "unit",
            "unit.staffPreference",
            "unit.staffPreference.staff",
          ],
        }
      );
      if (!activity) {
        return resError("Activity not found");
      }
    } catch (e) {
      return resError(
        "Query to find activity failed - this is probably because the uuid syntax is wrong"
      );
    }

    var candidates: StaffPreference[] = [];
    var r: any = [];
    // Find all staff with preferences in activity's unit
    const staffPreferences = activity.unit.staffPreference;
    if (staffPreferences) {
      for (var preference of staffPreferences) {
        // If the staff member isn't already allocated to the activity, check to see if they are available to be allocated to the activity
        if (
          activity.allocations.filter(function (e) {
            return e.staffId === preference.staffId;
          }).length == 0
        ) {
          if (await checkAllocation(preference.staff, activity)) {
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
   * @param activityCode activity code
   * @param sortingCriteria the criteria to sort the candidate pool by ("staff" or "lecturer")
   * @return StaffPreference[] sorted list of staff preferences that are potential candidates for an activity
   */
  // TODO: assert return value as Promise<StaffPreference[]> here
  @GET
  @Path(":activityId/candidates/:sortingCriteria")
  public async getSortedCandidates(
    @PathParam("activityId") id: string,
    @PathParam("sortingCriteria") sortingCriteria: string
  ) {
    // Get the activity given by the activityId, else return errors
    // Activity is joined with unit, staffpreferences, staff and availability here
    try {
      var activity = await this.repo.findOne(
        { id },
        {
          relations: [
            "allocations",
            "unit",
            "unit.staffPreference",
            "unit.staffPreference.staff",
            "unit.staffPreference.staff.availability",
            "unit.staffPreference.staff.allocations",
            "unit.staffPreference.staff.allocations.activity",
          ],
        }
      );
      if (!activity) {
        return resError("Activity not found");
      }
    } catch (e) {
      return resError(
        "Query to find activity failed - this is probably because the uuid syntax is wrong"
      );
    }

    var candidates: StaffPreference[] = [];

    // Find all staff with preferences in activity's unit
    var staffPreferences = activity.unit.staffPreference;
    if (staffPreferences) {
      for (var preference of staffPreferences) {
        // If the staff member isn't already allocated to the activity, check to see if they are available to be allocated to the activity
        if (
          activity.allocations.filter(function (e) {
            return e.staffId === preference.staffId;
          }).length == 0
        ) {
          if (await checkAllocation(preference.staff, activity)) {
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
   * Creates an activity
   * @param newRecord activity data
   * @return Activity new activity
   */
  @POST
  public async createActivity(newRecord: Activity): Promise<Activity> {
    // TODO: better optimisation since it's wasteful to fetch unit when we don't use it
    // potential solution: https://github.com/typeorm/typeorm/issues/447
    let unit = await getRepository(Unit).findOneOrFail({
      id: newRecord.unitId,
    });
    newRecord.unit = unit;
    return this.repo.save(this.repo.create(newRecord));
  }

  /**
   * Updates an activity
   * @param changedActivity new activity object to change existing activity to
   * @return Activity changed activity
   */
  @PUT
  public async updateActivity(changedActivity: Activity): Promise<Activity> {
    let activityToUpdate = await this.repo.findOneOrFail(changedActivity.id);

    // TODO: optimisation
    if (changedActivity.unitId) {
      let unit = await getRepository(Unit).findOneOrFail({
        id: changedActivity.unitId,
      });
      changedActivity.unit = unit;
    }
    activityToUpdate = changedActivity;
    return this.repo.save(activityToUpdate);
  }

  /**
   * Deletes an activity
   * @param activityCode activity code
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":activityId")
  public deleteActivity(
    @PathParam("activityId") id: string
  ): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}
