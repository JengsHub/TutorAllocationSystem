import { DeleteResult, getRepository } from "typeorm";
import {
  DELETE,
  GET,
  Path,
  PathParam,
  POST,
  PUT,
  QueryParam,
} from "typescript-rest";
import { Unit } from "~/entity";
import { Activity } from "../entity/Activity";

@Path("/activities")
class ActivitiesService {
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
   * Creates an activity
   * @param newRecord activity data
   * @return Activity new activity
   */
  @POST
  public async createActivity(
    newRecord: Activity
  ): Promise<Activity> {
    // TODO: better optimisation since it's wasteful to fetch unit when we don't use it
    // potential solution: https://github.com/typeorm/typeorm/issues/447
    let unit = await getRepository(Unit).findOneOrFail({ id: newRecord.unitId });
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
    let activityToUpdate = await this.repo.findOneOrFail(
      changedActivity.id
    );

    // TODO: optimisation
    if (changedActivity.unitId){
      let unit = await getRepository(Unit).findOneOrFail({ id: changedActivity.unitId });
      changedActivity.unit = unit
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
