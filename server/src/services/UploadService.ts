import { Request } from "express";
import { FileArray, UploadedFile } from "express-fileupload";
import { ContextRequest, Path, POST } from "typescript-rest";
import fs from "fs";
import csv from "csv-parser";
import ProcessFileService from "./ProcessFileService";

@Path("/upload")
class UploadService {
  @POST
  @Path("/tas")
  public uploadTas(@ContextRequest req: Request) {
    const file = (req.files as unknown) as FileArray;
    const path = (file.tas as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        console.log(row);
        processFileService.processTasObject(row);
      })
      .on("end", () => {
        console.log("TAS CSV file successfully processed");
      });
  }

  @POST
  @Path("/tps")
  public uploadTps(@ContextRequest req: Request) {
    const file = (req.files as unknown) as FileArray;
    const path = (file.tps as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        console.log(row);
        processFileService.processTpsObject(row);
      })
      .on("end", () => {
        console.log("TPS CSV file successfully processed");
      });
  }

  @POST
  @Path("/allocate")
  public uploadAllocate(@ContextRequest req: Request) {
    const file = (req.files as unknown) as FileArray;
    const path = (file.allocate as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        console.log(row);
        processFileService.processAllocateObject(row);
      })
      .on("end", () => {
        console.log("Allocate CSV file successfully processed");
      })
  };
}
