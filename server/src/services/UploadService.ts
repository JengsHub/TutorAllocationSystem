import { Request } from "express";
import { FileArray } from "express-fileupload";
import { ContextRequest, Path, POST } from "typescript-rest";
import { UploadControllerFactory } from "~/controller/UploadController";
import { Staff } from "~/entity/Staff";

@Path("/upload")
class UploadService {
  factory = new UploadControllerFactory();

  /**
   * Uploads the TAS csv file to be used by the rest of the system
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: allowed
   */
  @POST
  @Path("/tas")
  public async uploadTas(@ContextRequest req: Request) {
    const files = (req.files as unknown) as FileArray;
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.uploadTas(files);
  }

  /**
   * Uploads the TPS csv file to be used by the rest of the system
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: allowed
   */
  @POST
  @Path("/tps")
  public async uploadTps(@ContextRequest req: Request) {
    const files = (req.files as unknown) as FileArray;
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.uploadTps(files);
  }

  /**
   * Uploads the Allocate+ csv file to be used by the rest of the system
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: allowed
   */
  @POST
  @Path("/allocate")
  public async uploadAllocate(@ContextRequest req: Request) {
    const files = (req.files as unknown) as FileArray;
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.uploadAllocate(files);
  }
}
