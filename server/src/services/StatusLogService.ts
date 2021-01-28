import { createQueryBuilder, getRepository } from "typeorm";
import { GET, Path, PathParam } from "typescript-rest";
import { StatusLog } from "~/entity/StatusLog";

@Path("/statuslog")
class StatusLogService {
  repo = getRepository(StatusLog);

  /**
   * Gets all the status logs
   */
  @GET
  public async getAllStatusLogs() {
    return await this.repo.find();
  }

  /**
   * Get the status logs of an allocation with the staff and target staff objects attached to it
   * @param id id of the allocation
   */
  @GET
  @Path(":allocationId/staffs")
  public async getStatusLogsWithUsers(@PathParam("allocationId") id: string) {
    let statusLogs = await createQueryBuilder("StatusLog")
      .leftJoinAndSelect("StatusLog.staff", "Staff")
      .leftJoinAndSelect("StatusLog.targetStaff", "targetStaff")
      .where("StatusLog.allocationId = :allocationId", { allocationId: id })
      .getMany();
    return statusLogs;
  }

  /**
   * Gets all the status log with a particular allocationId
   * @param id allocation id to be used to find status logs
   */
  @GET
  @Path(":allocationId")
  public async getStatusLogs(@PathParam("allocationId") id: string) {
    let statusLog = await this.repo.find({ allocationId: id });
    return statusLog;
  }
}
