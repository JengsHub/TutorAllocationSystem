import { DeleteResult, getRepository } from "typeorm";
import {
  Server,
  Path,
  GET,
  PathParam,
  POST,
  DELETE,
  PATCH,
} from "typescript-rest";
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
    return this.repo.find();
  }

  /**
   * Returns an activity
   * @param activityCode activity code
   * @return Activity single activity
   */
  // TODO: assert return value as Promise<Activity> here
  @GET
  @Path(":activityCode")
  public getActivity(@PathParam("activityCode") activityCode: string) {
    return this.repo.findOne({ activityCode: activityCode });
  }

  /**
   * Creates an activity
   * @param newRecord activity data
   * @return Activity new activity
   */
  @POST
  public createActivity(newRecord: Activity): Promise<Activity> {
    return this.repo.save(this.repo.create(newRecord));
  }

  /**
   * Updates an activity
   * @param changedActivity new activity object to change existing activity to
   * @return Activity changed activity
   */
  @PATCH
  public async updateActivity(changedActivity: Activity): Promise<Activity> {
    let activityToUpdate = await this.repo.findOne(
      changedActivity.activityCode
    );
    activityToUpdate = changedActivity;
    return this.repo.save(activityToUpdate);
  }

  /**
   * Deletes an activity
   * @param activityCode activity code
   * @return DeleteResult result of delete request
   */
  @DELETE
  @Path(":activityCode")
  public deleteActivity(
    @PathParam("activityCode") activityCode: string
  ): Promise<DeleteResult> {
    return this.repo.delete({ activityCode: activityCode });
  }
}
