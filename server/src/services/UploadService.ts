import csv from "csv-parser";
import { Request } from "express";
import { FileArray, UploadedFile } from "express-fileupload";
import { ContextRequest, Path, POST } from "typescript-rest";
import { UploadControllerFactory } from "~/controller/UploadController";
import { Staff } from "~/entity";

@Path("/upload")
class UploadService {
  factory = new UploadControllerFactory();
  csvParseOptions: csv.Options = {
    mapHeaders: ({ header, index }) => {
      return header.trim();
    },
  };

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
    let user = req.user as Staff;
    const controller = this.factory.getController(
      await (req.user as Staff).getRoleTitle()
    );
    const files = (req.files as unknown) as FileArray;
    const path = (files.tas as UploadedFile).tempFilePath;
    controller.uploadTas(path, user);
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
    const controller = this.factory.getController(
      await (req.user as Staff).getRoleTitle()
    );
    const files = (req.files as unknown) as FileArray;
    const path = (files.tps as UploadedFile).tempFilePath;
    controller.uploadTps(path);
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
    const controller = this.factory.getController(
      await (req.user as Staff).getRoleTitle()
    );
    const files = (req.files as unknown) as FileArray;
    const path = (files.allocate as UploadedFile).tempFilePath;
    controller.uploadAllocate(path);
  }
}
