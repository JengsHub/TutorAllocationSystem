import { Request } from "express";
import { FileArray } from "express-fileupload";
import { ContextRequest, Path, POST } from "typescript-rest";
import fs from "fs";
import csv from "csv-parser";
import ProcessFileService, {
  mapRawAllocateFile,
  mapRawTasFile,
  mapRawTpsFile,
} from "../helpers/processInputFiles";
import { DayOfWeek } from "../enums/DayOfWeek";

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
    const path = (files.tas as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    let allRows: {
      givenNames: string;
      lastNames: string;
      preferenceScore: string;
      lecturerScore: string;
      isHeadTutorCandidate: number;
      aqf: string;
      email: string;
      unitCode: string;
      offeringPeriod: string;
      activityCode: string;
      activityGroup: string;
      campus: string;
      dayOfWeek: string;
      startTime: string;
      duration: number;
      location: string;
    }[] = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        // map the raw row into a an tas object that matches the system's convention
        const tasRow = mapRawTasFile(row);
        allRows.push(tasRow);
      })
      .on("end", async () => {
        console.log("TAS CSV file successfully read");
        for (let row of allRows) {
          await processFileService.processTasObject(row);
        }
        console.log("TAS CSV file successfully processed");
      });
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
    const path = (files.tps as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    let allRows: {
      aqfTarget: string;
      unitCode: string;
      offeringPeriod: string;
      campus: string;
      givenNames: string;
      lastNames: string;
      studyAqf: string;
      aqf: string;
      email: string;
      headCandidiate: number;
      preferenceScore: string;
      lecturerScore: string;
      availabilities: { day: DayOfWeek; start: any; end: any }[];
      maxHours: string;
      maxNumberActivities: string;
    }[] = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        // map the raw row into an tps object
        let tpsRow = mapRawTpsFile(row);
        allRows.push(tpsRow);
        // processFileService.processTpsObject(tpsRow);
      })
      .on("end", async () => {
        console.log("TPS CSV file successfully read");
        for (let row of allRows) {
          await processFileService.processTpsObject(row);
        }
        console.log("TPS CSV file successfully processed");
      });
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
    const path = (files.allocate as UploadedFile).tempFilePath;
    var processFileService: ProcessFileService = new ProcessFileService();
    let allRows: {
      unitCode: string;
      offeringPeriod: string;
      campus: string;
      activityCode: string;
      activityGroup: string;
      dayOfWeek: string;
      startTime: string;
      duration: string;
      location: string;
      studentCount: number;
      staff_in_charge: string;
    }[] = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        let allocateRow = mapRawAllocateFile(row);
        allRows.push(allocateRow);
      })
      .on("end", async () => {
        console.log("Allocate CSV file successfully read");
        console.log(allRows);
        for (let row of allRows) {
          await processFileService.processAllocateObject(row);
        }
        console.log("Allocate CSV file Successfully processed");
      });
  }
}
