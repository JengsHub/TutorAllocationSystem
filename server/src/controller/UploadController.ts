import csv from "csv-parser";
import { FileArray, UploadedFile } from "express-fileupload";
import fs from "fs";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import ProcessFileService, {
  AllocateObject,
  mapRawAllocateFile,
  mapRawTasFile,
  mapRawTpsFile,
  TasObject,
  TpsObject,
} from "~/helpers/processInputFiles";
import { UnauthorisedAccessedError } from "~/helpers/shortcuts";
import stripBom from "strip-bom-stream";
import { DayOfWeek } from "~/enums/DayOfWeek";
import { Staff } from "~/entity";

export class UploadControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IUploadController {
    switch (role) {
      case RoleEnum.TA:
        return new TaUploadController();
      case RoleEnum.LECTURER:
        return new LecturerUploadController();
      case AppRoleEnum.ADMIN:
        return new AdminUploadController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IUploadController {
  uploadTas(path: string, user: Staff): any;
  uploadTps(path: string): any;
  uploadAllocate(path: string): any;
}

class TaUploadController implements IUploadController {
  uploadTas(path: string, user: Staff) {
    return new UnauthorisedAccessedError("TAs cannot upload TAS files");
  }

  uploadTps(path: string) {
    return new UnauthorisedAccessedError("TAs cannot upload TPS files");
  }

  uploadAllocate(path: string) {
    return new UnauthorisedAccessedError("TAs cannot upload Allocate+ files");
  }
}

class LecturerUploadController implements IUploadController {
  uploadTas(path: string, user: Staff) {
    return new UnauthorisedAccessedError("Lecturers cannot upload TAS files");
  }

  uploadTps(path: string) {
    return new UnauthorisedAccessedError("Lecturers cannot upload TPS files");
  }

  uploadAllocate(path: string) {
    return new UnauthorisedAccessedError(
      "Lecturers cannot upload Allocate+ files"
    );
  }
}

class AdminUploadController implements IUploadController {
  csvParseOptions: csv.Options = {
    mapHeaders: ({ header, index }) => {
      return header.trim();
    },
  };

  uploadTas(path: string, user: Staff) {
    var processFileService: ProcessFileService = new ProcessFileService();
    let allRows: TasObject[] = [];
    fs.createReadStream(path)
      .pipe(stripBom())
      .pipe(csv(this.csvParseOptions))
      .on("data", (row) => {
        // map the raw row into a an tas object that matches the system's convention
        const tasRow = mapRawTasFile(row);
        if (tasRow !== null) allRows.push(tasRow);
      })
      .on("end", async () => {
        console.log("TAS CSV file successfully read");
        // FIXME: process and save all rows to db at once to reduce number of calls to db
        for (let row of allRows) {
          await processFileService.processTasObject(row, user);
        }
        console.log("TAS CSV file successfully processed");
      });
  }

  uploadTps(path: string) {
    var processFileService: ProcessFileService = new ProcessFileService();
    let allRows: TpsObject[] = [];
    fs.createReadStream(path)
      .pipe(stripBom())
      .pipe(csv(this.csvParseOptions))
      .on("data", (row) => {
        // map the raw row into an tps object
        let tpsRow = mapRawTpsFile(row);
        if (tpsRow !== null) allRows.push(tpsRow);
        // processFileService.processTpsObject(tpsRow);
      })
      .on("end", async () => {
        console.log("TPS CSV file successfully read");
        // FIXME: process and save all rows to db at once to reduce number of calls to db
        for (let row of allRows) {
          await processFileService.processTpsObject(row);
        }
        console.log("TPS CSV file successfully processed");
      });
  }

  uploadAllocate(path: string) {
    var processFileService: ProcessFileService = new ProcessFileService();
    let allRows: AllocateObject[] = [];
    fs.createReadStream(path)
      .pipe(stripBom())
      .pipe(csv(this.csvParseOptions))
      .on("data", (row) => {
        let allocateRow = mapRawAllocateFile(row);
        if (allocateRow !== null) allRows.push(allocateRow);
      })
      .on("end", async () => {
        console.log("Allocate CSV file successfully read");
        console.log(allRows);
        // FIXME: process and save all rows to db at once to reduce number of calls to db
        for (let row of allRows) {
          await processFileService.processAllocateObject(row);
        }
        console.log("Allocate CSV file Successfully processed");
      });
  }
}
