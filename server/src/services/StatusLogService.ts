import { getRepository } from "typeorm";
import { GET, Path, QueryParam } from "typescript-rest";
import { StatusLog } from "~/entity/StatusLog";

@Path("/statuslog")
class StatusLogService {
  repo = getRepository(StatusLog);

  @GET
  public async getStatusLogs(
    @QueryParam("allocationId") allocationId: string
  ) {
    let params: { [key: string]: any } = {
        allocationId
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    return StatusLog.find(params);
  }