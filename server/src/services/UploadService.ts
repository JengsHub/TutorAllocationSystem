import { Request } from "express";
import { FileArray, UploadedFile } from "express-fileupload";
import { ContextRequest, Path, POST } from "typescript-rest";
import fs from "fs";
import csv from "csv-parser";

@Path("/upload")
class UploadService {
  @POST
  @Path("/tas")
  public uploadTas(@ContextRequest req: Request) {
    const files = (req.files as unknown) as FileArray;
    const path = (files.tas as UploadedFile).tempFilePath;
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        console.log(row);
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
      });
  }
}
