import { Request } from "express";
import { FileArray, UploadedFile } from "express-fileupload";
import { ContextRequest, Path, POST } from "typescript-rest";
import fs from "fs";
import csv from "csv-parser";
import ProcessFileService, {
  mapRawAllocateFile,
  mapRawTasFile,
  mapRawTpsFile,
} from "../helpers/processInputFiles";

@Path("/upload")
class UploadService {
  @POST
  @Path("/tas")
  public uploadTas(@ContextRequest req: Request) {
    const files = (req.files as unknown) as FileArray;
    const path = (files.tas as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        // map the raw row into a an tas object that matches the system's convention
        const tasRow = mapRawTasFile(row);
        processFileService.processTasObject(tasRow);
      })
      .on("end", () => {
        console.log("TAS CSV file successfully processed");
      });
  }

  @POST
  @Path("/tps")
  public uploadTps(@ContextRequest req: Request) {
    const files = (req.files as unknown) as FileArray;
    const path = (files.tps as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        // map the raw row into an tps object
        const tpsRow = mapRawTpsFile(row);
        processFileService.processTpsObject(tpsRow);
      })
      .on("end", () => {
        console.log("TPS CSV file successfully processed");
      });
  }

  @POST
  @Path("/allocate")
  public uploadAllocate(@ContextRequest req: Request) {
    const files = (req.files as unknown) as FileArray;
    const path = (files.allocate as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        let allocateRow = mapRawAllocateFile(row);
        processFileService.processAllocateObject(allocateRow);
      })
      .on("end", () => {
        console.log("Allocate CSV file successfully processed");
      });
  }
}
