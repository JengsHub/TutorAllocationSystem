import { getRepository } from "typeorm";
import {Server, Path, GET, PathParam} from "typescript-rest";
import { Activity } from "../entity/activity";

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
    @Path(':activityCode')
    public getAdmin(@PathParam('activityCode') activityCode: string) {
        return this.repo.findOne({activityCode: activityCode});
    }

    // Create activity

    // Update activity

    // Delete activity

}